import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Menu } from '@mantine/core';
import { IconLanguage, IconChevronDown } from '@tabler/icons-react';

export const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const getCurrentLanguageLabel = () => {
    return i18n.language === 'ru' ? 'Русский' : 'English';
  };

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button
          variant="light"
          leftSection={<IconLanguage size={16} />}
          rightSection={<IconChevronDown size={16} />}
          size="sm"
        >
          {getCurrentLanguageLabel()}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{t('common.language.switchLanguage')}</Menu.Label>
        <Menu.Item
          onClick={() => changeLanguage('en')}
          style={{
            backgroundColor: i18n.language === 'en' ? 'var(--mantine-color-blue-0)' : undefined,
          }}
        >
          {t('common.language.english')}
        </Menu.Item>
        <Menu.Item
          onClick={() => changeLanguage('ru')}
          style={{
            backgroundColor: i18n.language === 'ru' ? 'var(--mantine-color-blue-0)' : undefined,
          }}
        >
          {t('common.language.russian')}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}; 