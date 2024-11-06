'use client'

import { Container, VStack, Button, Input, HStack, Heading, Box } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { CardInstaPost } from "@/components";
import { useInstagramStatus } from "@/lib/instagram";

interface Post {
  caption: string;
  hashtags: string[];
  carousel: {
    citation: string;
    image: string;
  }[];
}

export default function Home() {
  const { data: instagramStatus } = useInstagramStatus()
  const [prompt, setPrompt] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleGenerate = () => {    
    fetch('/api/openai/post', {
      method: 'POST',
      body: JSON.stringify({ prompt })
    })
    .then(response => response.json())
    .then(data => {
      setCurrentPost(data.posts[0]);
      setCurrentImageIndex(0);
    });
  };

  const handleNextImage = () => {
    if (currentPost && currentImageIndex < currentPost.carousel.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
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
          {currentPost && (
            <Box position="relative" width="full">
              <CardInstaPost
                userId={instagramStatus?.user?.id}
                username={instagramStatus?.user?.username || 'username'}
                avatar="https://tinyurl.com/2p8h98w8"
                image={currentPost.carousel[currentImageIndex].image}
                caption={currentPost.caption}
                timestamp="Just now"
              />
              
              {currentPost.carousel.length > 1 && (
                <HStack 
                  position="absolute" 
                  top="50%" 
                  width="full" 
                  justify="space-between" 
                  px={4}
                  transform="translateY(-50%)"
                >
                  <Button
                    onClick={handlePrevImage}
                    disabled={currentImageIndex === 0}
                    size="sm"
                    variant="ghost"
                    colorScheme="blackAlpha"
                  >
                    ←
                  </Button>
                  <Button
                    onClick={handleNextImage}
                    disabled={currentImageIndex === currentPost.carousel.length - 1}
                    size="sm"
                    variant="ghost"
                    colorScheme="blackAlpha"
                  >
                    →
                  </Button>
                </HStack>
              )}
            </Box>
          )}
        </VStack>
      </VStack>
    </Container>
  );
}
