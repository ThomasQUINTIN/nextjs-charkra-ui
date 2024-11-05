import { Box, Button, Card, HStack, Icon } from '@chakra-ui/react'
import { LuCheck } from 'react-icons/lu'
import Link from 'next/link'

interface AuthCardProps {
  icon: React.ReactNode
  title: string
  description: string
  connected?: boolean
  children?: React.ReactNode
  handleConnect?: () => void
  href?: string
  connectedAccount?: string
}

export const AuthCard = (props: AuthCardProps) => {
  const { icon, title, description, connected, children, handleConnect, href, connectedAccount } = props

  const ConnectButton = () => (
    <Button disabled={connected} size="sm" variant="outline" colorPalette="gray" bg="bg" onClick={handleConnect}>
      {connected && (
        <Icon color="fg.success">
          <LuCheck />
        </Icon>
      )}
      {connected ? 'Connected' : 'Connect'}
    </Button>
  )
  return (
    <Card.Root size="sm">
      <Card.Body>
        <HStack gap="4">
          {icon}
          <Box flex="1">
            <Card.Title>{title}</Card.Title>
            <Card.Description>{connectedAccount ? `( ${connectedAccount} )` : description}</Card.Description>
          </Box>
          {href ? (
            <Link href={href} passHref legacyBehavior>
              <ConnectButton />
            </Link>
          ) : (
            <ConnectButton />
          )}
        </HStack>
      </Card.Body>
      {children && <Card.Footer>{children}</Card.Footer>}
    </Card.Root>
  )
}
