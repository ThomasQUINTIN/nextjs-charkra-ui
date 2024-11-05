'use client';

import { Container, HStack, Heading, Input, Link, Stack, Text } from '@chakra-ui/react'
import { BsGoogle } from 'react-icons/bs'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field } from '@/components/ui/field'
import { PasswordInput } from '@/components/ui/password-input'
import { Logo } from './logo'

export const Block = () => (
  <Container maxW="md" py={{ base: '12', md: '24' }}>
    <Stack gap="8">
      <Logo />
      <Stack gap={{ base: '2', md: '3' }} textAlign="center">
        <Heading size={{ base: '2xl', md: '3xl' }}>Welcome back</Heading>
        <Text color="fg.muted">Start using Chakra in your projects</Text>
      </Stack>

      <Stack gap="6">
        <Stack gap="5">
          <Field label="Email">
            <Input type="email" />
          </Field>
          <Field label="Password">
            <PasswordInput />
          </Field>
        </Stack>
        <HStack justify="space-between">
          <Checkbox defaultChecked>Remember me</Checkbox>
          <Button variant="plain" size="sm">
            Forgot password
          </Button>
        </HStack>
        <Stack gap="4">
          <Button>Sign in</Button>
          <Button variant="outline">
            <BsGoogle />
            Sign in with Google
          </Button>
        </Stack>
      </Stack>

      <Text textStyle="sm" color="fg.muted" textAlign="center">
        Don&apos;t have an account?{' '}
        <Link variant="underline" href="#">
          Sign up
        </Link>
      </Text>
    </Stack>
  </Container>
)
