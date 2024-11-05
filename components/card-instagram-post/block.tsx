import { AspectRatio, Box, Card, HStack, Image, Stack, Text } from '@chakra-ui/react'
import { Avatar } from '@/components/ui/avatar'

interface BlockProps {
  username: string
  avatar: string
  image: string
  location?: string
  likes?: number
  caption?: string
  timestamp?: string
}

export const Block = ({ username, avatar, image, location, likes, caption, timestamp }: BlockProps) => {
  return (
    <Card.Root overflow="hidden" maxW="lg">
      <Card.Header p="3">
        <HStack gap="3">
          <Avatar size="sm" src={avatar} />
          <Stack gap={0} flex="1">
            <Text fontWeight="medium" fontSize="sm">
              {username}
            </Text>
            {location && (
              <Text fontSize="xs" color="fg.muted">
                {location}
              </Text>
            )}
          </Stack>
          <Box as="button" h="6" w="6" color="fg.muted">
            {/* Trois points icon */}
            <svg viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="6" cy="12" r="1.5" />
              <circle cx="18" cy="12" r="1.5" />
            </svg>
          </Box>
        </HStack>
      </Card.Header>
      <AspectRatio ratio={1}>
        <Image src={image} alt="Post" objectFit="cover" />
      </AspectRatio>
      <Card.Body pt="3" pb="2" px="3">
        <Stack gap="3">
          <HStack gap="4">
            <HStack gap="3">
              <Box as="button" h="6" w="6" color="fg.muted">
                {/* Heart icon */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </Box>
              <Box as="button" h="6" w="6" color="fg.muted">
                {/* Comment icon */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </Box>
              <Box as="button" h="6" w="6" color="fg.muted">
                {/* Share icon */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 3L9.218 10.083M11.698 20.334L22 3.001H2L9.218 10.084 11.698 20.334z" />
                </svg>
              </Box>
            </HStack>
            <Box flex="1" />
            <Box as="button" h="6" w="6" color="fg.muted">
              {/* Bookmark icon */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </Box>
          </HStack>
          {likes && (
            <Text fontWeight="medium" fontSize="sm">
              {likes.toLocaleString()} likes
            </Text>
          )}
          {caption && (
            <Text fontSize="sm">
              <Text as="span" fontWeight="medium">{username}</Text>
              {' '}
              {caption}
            </Text>
          )}
          {timestamp && (
            <Text fontSize="xs" color="fg.muted" textTransform="uppercase">
              {timestamp}
            </Text>
          )}
        </Stack>
      </Card.Body>
    </Card.Root>
  )
}
