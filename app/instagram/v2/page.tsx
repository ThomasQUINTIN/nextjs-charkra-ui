'use client'

import { Container, VStack, Button, Input, HStack, Heading, Box } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { CardInstaPost } from "@/components";
import { useInstagramStatus } from "@/lib/instagram";
import { ContainerElement, Container as GenContainer } from "@/app/api/openai/gen/types.dto";

export default function Home() {
  const { data: instagramStatus } = useInstagramStatus()
  const [prompt, setPrompt] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [posts, setPosts] = useState<(GenContainer & { container: (ContainerElement & { image: string })[] })[]>([]);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);

  const handleGenerate = () => {    
    fetch('/api/openai/gen', {
      method: 'POST',
      body: JSON.stringify({ prompt, theme: 'static-citation' })
    })
    .then(response => response.json())
    .then((data: (GenContainer & { container: (ContainerElement & { image: string })[] })[]) => {
      setPosts(data);
      setCurrentPostIndex(0);
    });
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Container maxW="xl" py="20">
      <VStack gap={6}>
        <Heading size={{ base: '2xl', md: '3xl' }}>
          Générer un post Instagram avec un prompt
        </Heading>
        <HStack width="full" gap={4}>
          <Input
            placeholder="Entrez votre prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button
            colorScheme="blue"
            onClick={handleGenerate}
          >
            Générer
          </Button>
        </HStack>
        <VStack gap={4} align="center">
          {posts.length > 0 && (
            <Box position="relative" width="full">
              <CardInstaPost
                userId={instagramStatus?.user?.id}
                username={instagramStatus?.user?.username || 'username'}
                avatar="https://tinyurl.com/2p8h98w8"
                image={posts[currentPostIndex].container[0].image}
                caption={posts[currentPostIndex].container[0].caption.content}
                timestamp="Just now"
              />
            </Box>
          )}
        </VStack>
      </VStack>
    </Container>
  );
}
