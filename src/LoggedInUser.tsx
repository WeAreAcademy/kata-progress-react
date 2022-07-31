import { Badge, Box, Flex, Image, Text } from "@chakra-ui/react";
import { User } from "firebase/auth";

interface LoggedInUserProps {
    user: User;
    isFaculty: boolean;
}

export function LoggedInUser({ user, isFaculty }: LoggedInUserProps) {

    return (<Flex>
        {/* <Avatar src='https://bit.ly/sage-adebayo' /> */}
        {user.photoURL && <Image
            boxSize='64px'
            objectFit='cover'
            src={user.photoURL}
            borderRadius="full"
            alt={"profile of " + user.displayName}
        />}
        <Box ml='3'>
            <Text fontWeight='bold'>
                {user.displayName}
                {isFaculty && <Badge ml='1' colorScheme='green'>
                    Faculty
                </Badge>}
            </Text>
            <Text fontSize='sm'>{user.email}</Text>
            <Text fontSize='sm'>{user.uid}</Text>
        </Box>
    </Flex>
    )



}