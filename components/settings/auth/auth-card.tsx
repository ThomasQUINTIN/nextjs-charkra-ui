import { Box, Button, Card, HStack, Icon } from '@chakra-ui/react'
import { LuCheck } from 'react-icons/lu'
import Link from 'next/link'
import { timeAgo } from '@/lib/ago'

interface AuthCardProps {
  icon: React.ReactNode
  title: string
  description: string
  connected?: boolean
  children?: React.ReactNode
  handleConnect?: () => void
  href?: string
  connectedAccount?: string
  expiredAccount?: Date
}

export const AuthCard = (props: AuthCardProps) => {
  const { icon, title, description, connected, children, handleConnect, href, connectedAccount, expiredAccount } = props

  return (
    <Card.Root size="sm">
      <Card.Body>
        <HStack gap="4">
          {icon}
          <Box flex="1">
            <Card.Title>{title}</Card.Title>
            <Card.Description>{connectedAccount ? `${connectedAccount} (${expiredAccount ? timeAgo(expiredAccount, undefined, true) : 'never'})` : description}</Card.Description>
          </Box>
          <Link href={href || '/'} passHref legacyBehavior={!href}>
            <Button disabled={connected} size="sm" variant="outline" colorPalette="gray" bg="bg" onClick={handleConnect}>
              {connected && (
                <Icon color="fg.success">
                  <LuCheck />
                </Icon>
              )}
              {connected ? 'Connected' : 'Connect'}
            </Button>
          </Link>
        </HStack>
      </Card.Body>
      {children && <Card.Footer>{children}</Card.Footer>}
    </Card.Root>
  )
}
