'use client';
import { Container, Spacer, Stack, Text } from '@chakra-ui/react';
import { SiInstagram } from 'react-icons/si';
import { AuthCard } from './auth-card'
import { ThemeSelector } from '../theme-selector'
import { instagramAuthUrl, useInstagramStatus } from '@/lib/instagram';

export const Block = () => {
  const { data: instagramStatus } = useInstagramStatus()

  return (
    <Container maxW="xl" py="20">
      <Stack gap="6">
        <Stack gap="1">
          <Text fontWeight="semibold" textStyle="lg">
            Authentication
          </Text>
          <Text color="fg.muted">Manage your authentication settings</Text>
        </Stack>
        <Stack gap="4">
          {/* <AuthCard
            icon={<LuAtSign />}
            title="Email"
            description="You can use your email to sign in"
            connected
          >
            <Flex gap="4" align="center" width="full">
              <Text textStyle="sm" flex="1">
                john@doe.com
              </Text>
              <HStack colorPalette="gray">
                <Button size="xs" variant="outline">
                  Change email
                </Button>
                <Button size="xs" variant="outline">
                  Change password
                </Button>
              </HStack>
            </Flex>
          </AuthCard> */}
          {/* <AuthCard icon={<SiGoogle />} title="Google" description="Connect your Google account" />
          <AuthCard icon={<SiApple />} title="Apple" description="Connect your Apple account" /> */}
          <AuthCard icon={<SiInstagram />} title="Instagram" description="Connect your Instagram account" href={instagramAuthUrl()} connected={instagramStatus?.isConnected} connectedAccount={instagramStatus?.user?.username}/>
        </Stack>
        <Spacer />
        <Text color="fg.muted">Manage your theme settings</Text>
        <ThemeSelector />
      </Stack>
    </Container>
  )
}
