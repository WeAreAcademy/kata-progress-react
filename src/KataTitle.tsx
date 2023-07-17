import { Text, Tooltip, Link } from "@chakra-ui/react";
import { Kata } from "./types";

interface KataTitleProps {
    kata: Kata;
}

export function KataTitle({ kata }: KataTitleProps) {
    return (
        <Tooltip label={kata.name}>
            <Link
                // color="teal.500"
                href={kata.url}
                target="_blank"
                rel="noopener noreferrer"
            >
                {/* Truncation */}
                <Text noOfLines={1} maxW="lg">
                    {kata.name}
                </Text>
            </Link>
        </Tooltip>
    );
}
