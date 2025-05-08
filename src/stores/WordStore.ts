import { makeAutoObservable, runInAction } from 'mobx';
import { words } from './words';
import type { Word } from '../types';

// Type definitions for the words structure
interface WordsByCategory {
  [category: string]: string[];
}

interface WordsByDifficulty {
  [difficulty: string]: WordsByCategory;
}

interface WordsByLanguage {
  [language: string]: WordsByDifficulty;
}

class WordStore {
  words: Map<string, Word> = new Map();
  initialized: boolean = false;

  constructor() {
    makeAutoObservable(this);
    this.initializeFromSource();
  }

  async initializeFromSource() {
    if (this.initialized) return;

    try {
      const typedWords = words as WordsByLanguage;
      const allWords: Word[] = [];
      
      // Build array of all words
      for (const language of Object.keys(typedWords)) {
        for (const difficulty of Object.keys(typedWords[language])) {
          for (const category of Object.keys(typedWords[language][difficulty])) {
            const wordsList = typedWords[language][difficulty][category];
            
            wordsList.forEach(word => {
              const wordObj: Word = {
                _id: this.generateId(),
                text: word,
                category,
                difficulty: difficulty as 'easy' | 'medium' | 'hard',
                language
              };
              allWords.push(wordObj);
            });
          }
        }
      }
      
      // Store words in the map
      runInAction(() => {
        allWords.forEach(word => {
          this.words.set(word._id, word);
        });
        this.initialized = true;
      });
      
      return { success: true, count: allWords.length };
    } catch (error) {
      console.error('Error initializing words:', error);
      throw new Error('Failed to initialize words');
    }
  }

  async getRandomWords(count: number, filter: Record<string, string> = {}): Promise<Word[]> {
    if (!count || count <= 0) {
      throw new Error('Count must be a positive number');
    }
    
    // Make sure words are initialized
    if (!this.initialized) {
      await this.initializeFromSource();
    }
    
    try {
      // Filter words according to criteria
      let filteredWords = Array.from(this.words.values());
      
      // Apply filters
      if (filter.difficulty) {
        filteredWords = filteredWords.filter(word => word.difficulty === filter.difficulty);
      }
      
      if (filter.category) {
        filteredWords = filteredWords.filter(word => word.category === filter.category);
      }
      
      if (filter.language) {
        filteredWords = filteredWords.filter(word => word.language === filter.language);
      }
      
      // If no words match the filter, return empty array
      if (filteredWords.length === 0) {
        return [];
      }
      
      // If we don't have enough words, just return what we have
      if (filteredWords.length <= count) {
        return this.shuffleArray(filteredWords);
      }
      
      // Pick random words
      return this.shuffleArray(filteredWords).slice(0, count);
    } catch (error) {
      console.error('Error fetching random words:', error);
      throw new Error('Failed to fetch random words');
    }
  }

  // Helper function to shuffle an array
  private shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  // Helper to generate unique IDs
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}

export const wordStore = new WordStore(); 