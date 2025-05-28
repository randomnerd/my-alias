# Project Brief: Alias Word Game

## Overview
Alias is a multilingual multiplayer word-guessing game where players try to explain words to their teammates without using the word itself or its derivatives. The digital version allows players to create teams, play rounds, and track scores with state persistence across sessions. The application supports multiple languages with seamless language switching.

## Core Requirements
- Team formation and management
- Game play mechanics (word presentation, timing, scoring)
- Round-based gameplay with team rotation
- Modern and responsive UI with Mantine components
- Game progression and scoring system
- Score limit functionality to determine game end condition
- Client-side state management with MobX
- State persistence across browser sessions
- Flexible gameplay controls (pause, resume, end early)
- Internationalization (i18n) support for multiple languages

## Goals
- Create an engaging digital version of the popular Alias word game
- Enable in-person multiplayer experiences
- Provide a responsive, intuitive UI for gameplay
- Implement efficient client-side state management
- Ensure state persistence to prevent data loss
- Create smooth animations and transitions for enhanced UX
- Provide flexible gameplay options for various scenarios
- Support multiple languages for global accessibility

## Implemented Features
- Team setup and management
- Round-based gameplay with timer
- Word guessing mechanics (correct/skip)
- Score tracking
- Difficulty settings
- Modern UI with Mantine components
- Score limit functionality
- Optional penalties for skipped words
- Round summary with word status adjustment
- MobX state management architecture
- LocalStorage persistence for game state
- Pause/resume functionality with word hiding
- Early round ending option
- Smooth animations and transitions
- Team-specific color coding
- Enhanced gameplay UI with feedback
- **Complete internationalization (i18n) implementation:**
  - **English and Russian language support**
  - **Dynamic language switching with persistence**
  - **Namespaced translation organization**
  - **Proper interpolation for dynamic content**
  - **Cultural adaptation of translations**
  - **Zero hardcoded strings in UI components**