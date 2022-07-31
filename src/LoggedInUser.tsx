import { HStack, Image, Text } from "@chakra-ui/react";
import { User } from "firebase/auth";

interface LoggedInUserProps {
    user: User;
}

export function LoggedInUser({ user }: LoggedInUserProps) {

    return <HStack>
        <Text>{user.displayName} - {user.email}({user.uid})</Text> {
            user.photoURL &&
            <Image
                boxSize='64px'
                objectFit='cover'
                src={user.photoURL}
                borderRadius="full"
                alt={"profile of " + user.displayName}
            />
        }
    </HStack>
}