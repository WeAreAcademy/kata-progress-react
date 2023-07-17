import {
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tooltip,
    Tr,
    VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { User } from "firebase/auth";
import React, { useEffect } from "react";
import { apiBaseURL, createAuthHeaders } from "./APIUtils";
import { KataTitle } from "./KataTitle";
import { Kata, SimpleUser } from "./types";

interface KataWithAllUsers {
    kata: Kata;
    users: SimpleUser[];
}
interface AllKatasWithCompletersViewProps {
    loggedInUser: User;
}
export function AllKatasWithCompletersView(
    props: AllKatasWithCompletersViewProps
) {
    const [katas, setKatas] = React.useState<KataWithAllUsers[]>([]);

    useEffect(() => {
        async function fetchAndStoreKatasWithAllCompleters() {
            console.log("getting katas with completers");
            const headers = await createAuthHeaders(props.loggedInUser);

            const response = await axios.get(apiBaseURL + "/katas/all_users", {
                headers,
            });

            const dbData = response.data.data;
            console.log({ dbData });
            setKatas(dbData.katas);
        }

        fetchAndStoreKatasWithAllCompleters();
    }, [props.loggedInUser]);

    return (
        <TableContainer>
            <Table>
                <TableCaption>
                    All katas and who has completed them
                </TableCaption>
                <Thead>
                    <Tr>
                        <Th>Kata Title</Th>
                        <Th>Difficulty</Th>
                        <Th>Num completers</Th>
                        <Th>List of Users</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {katas.map((k) => (
                        <Tr key={k.kata.id}>
                            <Td>
                                <KataTitle kata={k.kata} />
                            </Td>

                            <Td>{k.kata.difficulty}</Td>
                            <Td>{k.users.length}</Td>

                            <Td>
                                <VStack>
                                    {k.users.map((u) => (
                                        <Tooltip label={u.email} key={u.id}>
                                            {u.display_name}
                                        </Tooltip>
                                    ))}
                                </VStack>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    );
}
