'use client'

import { Container, VStack, Button, Input, HStack, Heading, Box } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { CardInstaPost } from "@/components";

interface Post {
  caption: string;
  hashtags: string[];
  carousel: {
    citation: string;
    image: string;
  }[];
}

export default function Home() {
  const [caption, setCaption] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      imageUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const handleGenerate = () => {
    imageUrls.forEach(url => URL.revokeObjectURL(url));
    
    fetch('/api/openai/post', {
      method: 'POST',
      body: JSON.stringify({ prompt: caption })
    })
    .then(response => response.json())
    .then(data => {
      setCurrentPost(data.posts[0]);
      setCurrentImageIndex(0);
      
      const urls = data.posts[0].carousel.map((item: Post['carousel'][number]) => {
        const byteCharacters = atob(item.image);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        
        return URL.createObjectURL(blob);
      });
      
      setImageUrls(urls);
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
            placeholder="Entrez votre caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
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
                username="your_username"
                avatar="https://tinyurl.com/2p8h98w8"
                image={imageUrls[currentImageIndex]}
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
