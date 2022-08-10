import { Text, TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Tooltip, Link, HStack, Checkbox } from "@chakra-ui/react";
import axios from "axios";
import { User } from "firebase/auth";
import React, { useEffect } from "react";
import { apiBaseURL, createAuthHeaders } from "./APIUtils";
import { Kata, SimpleUser } from "./types";


interface InProgressKataForUser {
    kata: Kata;
    user: SimpleUser;
}
interface InProgressKatasViewProps {
    loggedInUser: User;
}
export function InProgressKatasView(props: InProgressKatasViewProps) {
    const [inProgressKatas, setInProgressKatas] = React.useState<InProgressKataForUser[]>([]);

    useEffect(() => {
        async function fetchAndStoreInProgressKatas() {

            const headers = await createAuthHeaders(props.loggedInUser);

            const response = await axios.get(apiBaseURL + "/katas/in_progress", { headers });
            const dbData = response.data.data;
            const mergedData = dbData.map((rawRow: any) => formObjects(rawRow))
            setInProgressKatas(mergedData);
        }

        fetchAndStoreInProgressKatas();
    }, []);

    return (
        <TableContainer>
            <Table >
                <TableCaption>In-progress katas</TableCaption>
                <Thead>
                    <Tr>
                        <Th>User</Th>
                        <Th>Kata Title</Th>
                        <Th>Difficulty</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {inProgressKatas.map(ipk => (
                        <Tr key={ipk.kata.id}>


                            <Td>
                                <Tooltip label={ipk.user.email}>
                                    {ipk.user.display_name}
                                </Tooltip>

                            </Td>
                            <Td>
                                <KataTitle kata={ipk.kata} />
                            </Td>

                            <Td>
                                {ipk.kata.difficulty}
                            </Td>
                        </Tr>


                    ))}

                </Tbody>
            </Table>
        </TableContainer>

    )
}

/** 

*/
interface KataTitleProps {
    kata: Kata
}

function KataTitle({ kata }: KataTitleProps) {
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
    )
}

/** split out a db row data of key-value pairs where keys are user_blah1, user_blah2, kata_blah3 
 * into an object with two collected user and kata object. */
function formObjects(row: Object): InProgressKataForUser {
    const objects: { [key: string]: any } = {};
    for (const entry of Object.entries(row)) {
        const [key, value] = entry;
        const [objIndicator, ...rest] = key.split("_");
        const propertyName = rest.join("_");
        if (!(objIndicator in objects)) {
            objects[objIndicator] = {}
        }
        objects[objIndicator][propertyName] = value;
    }
    return { kata: objects.kata, user: objects.user }
}

//example:
//     user_id,
//     kata_id,
//     kata_url,       
//     kata_difficulty,
//     user_display_name,
//     user_email, 
//     kata_title
//
//will become
/*
{
    user: {
        id,
        display_name,
        email
    },
    kata: {
       id,
       url,       
       difficulty,
       title
    }
}
*/