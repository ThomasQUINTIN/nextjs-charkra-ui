import { Flex, RadioCard, Text } from '@chakra-ui/react'
import { DarkModeIcon, LightModeIcon, SystemModeIcon } from './theme-icons'
import { useTheme } from 'next-themes'

export const ThemeSelector = () => {
  const { resolvedTheme, setTheme } = useTheme()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTheme(e.target.value as string)
  }

  return (
    <RadioCard.Root size="sm" defaultValue={resolvedTheme} width="full" onChange={handleChange}>
      <Flex gap="4">
        {items.map((item) => (
          <RadioCard.Item key={item.value} value={item.value} overflow="hidden" flex="1">
            <RadioCard.ItemHiddenInput />
            {item.icon}
            <RadioCard.ItemControl p="2.5" alignItems="center">
              <RadioCard.ItemIndicator />
              <Text>{item.label}</Text>
            </RadioCard.ItemControl>
          </RadioCard.Item>
        ))}
      </Flex>
    </RadioCard.Root>
  )
}

const items = [
  {
    value: 'system',
    icon: <SystemModeIcon />,
    label: 'System',
  },
  {
    value: 'light',
    icon: <LightModeIcon />,
    label: 'Light',
  },
  {
    value: 'dark',
    icon: <DarkModeIcon />,
    label: 'Dark',
  },
]
