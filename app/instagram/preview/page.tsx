import { CardInstaPost } from "@/components";
import { Container } from "@chakra-ui/react";

export default async function Home({
  searchParams
}: {
  searchParams: Promise<{
    likes?: number,
    username?: string,
    location?: string,
    avatar?: string,
    image?: string,
    caption?: string,
    timestamp?: string
  }>
}) {
  const params = await searchParams;
    
  return (
    <Container maxW="xl" py="20">
      <CardInstaPost 
        likes={params.likes} 
        username={params.username || "john@doe.com"} 
        location={params.location} 
        avatar={params.avatar || "https://tinyurl.com/2p8h98w8"} 
        image={params.image || "https://tinyurl.com/2p8h98w8"} 
        caption={params.caption} 
        timestamp={params.timestamp} 
      />
    </Container>
  );
}
