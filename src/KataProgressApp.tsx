import {
    Box, Checkbox, Input, Link, Table, TableCaption, TableContainer, Tbody, Td, Text, Th, Thead, Tooltip, Tr, useToast
} from "@chakra-ui/react";
import axios from "axios";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { sortDecoratedKatas } from "./kataUtils";
import { LoggedInUser } from "./LoggedInUser";
import { DecoratedKata, Kata, KataProgressData } from "./types";

interface KataProgressAppProps {
    user: User;
}

const apiBaseURL = "http://localhost:4000"
export function KataProgressApp({ user }: KataProgressAppProps) {
    const [katas, setKatas] = useState<Kata[]>([]);
    const [katasProgressData, setKatasProgressData] = useState<KataProgressData[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const toast = useToast()

    useEffect(() => {
        async function fetchAndSaveKatas() {
            const katasRes = await fetch(`${apiBaseURL}/katas`);
            const katasData = await katasRes.json();
            const progressRes = await fetch(`${apiBaseURL}/user/${user.uid}/kata_progress`);
            const progressData = await progressRes.json();
            setKatas(katasData.data.katas);
            setKatasProgressData(progressData.data);
        }
        fetchAndSaveKatas();
    }, [user]);

    const decoratedKatas: DecoratedKata[] = calcDecoratedKatas();
    function calcDecoratedKatas() {
        return katas.map(k => {
            const progress = katasProgressData.find(pd => pd.kata_id === k.id)
            const dk: DecoratedKata = { kata: k, progress }
            dk.progress = progress;
            return dk;
        })
    }


    async function updateStatusOnKata(user_id: string, kata_id: string, newStatus: boolean) {
        console.log(`would update status on kata ${kata_id} for user: ${user_id}`)
        const headers = { "Authorization": "Bearer " + await user.getIdToken() }
        const url = `${apiBaseURL}/user/${user_id}/kata/${kata_id}/progress`
        const body = {
            user_id: user_id,
            kata_id: kata_id,
            is_done: newStatus
        }
        try {
            const res = await axios.post(url, body, { headers })
            if (res.status >= 200 && res.status < 400) {
                toast({
                    title: 'Updated kata status',
                    description: "Now set to " + (newStatus ? "completed" : "not completed"),
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                })

            }
        } catch (err) {

            toast({
                title: 'Problem updating kata status',
                description: "Error communicating with server - Please retry later",
                status: "error",
                duration: 2000,
                isClosable: true,
            })

        }

    }

    const decoratedKatasToShow = sortDecoratedKatas(decoratedKatas.filter(k => k.kata.status !== "not ready").filter(k => k.kata.name.toLowerCase().includes(searchTerm.toLowerCase())))
    const countOfDoneKatas = decoratedKatas.filter(dk => dk.progress?.is_done).length;

    return (
        <Box>
            <div>Logged in as <LoggedInUser user={user} /></div>
            <div>You have recorded {countOfDoneKatas} as done</div>
            <Input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder='search here...'
                size='sm'
            />
            <TableContainer>
                <Table >
                    <TableCaption>Kata Progress</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>difficulty</Th>
                            <Th>My progress</Th>
                            <Th>Kata Title</Th>

                        </Tr>
                    </Thead>
                    <Tbody>
                        {decoratedKatasToShow.map(k => (
                            <Tr key={k.kata.id}>

                                <Td>
                                    {k.kata.difficulty}
                                </Td>
                                <Td>
                                    <Checkbox
                                        onChange={(e) => updateStatusOnKata(user.uid, k.kata.id, e.target.checked)}
                                        isChecked={k.progress?.is_done}
                                    >done</Checkbox>
                                </Td>
                                <Td>
                                    <Tooltip label={k.kata.name}>
                                        <Link
                                            // color="teal.500"
                                            href={k.kata.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {/* truncation */}
                                            <Text noOfLines={1} maxW="lg">
                                                {k.kata.name}
                                            </Text>
                                        </Link>
                                    </Tooltip>
                                </Td>
                            </Tr>


                        ))}

                    </Tbody>
                </Table>
            </TableContainer>

        </Box >
    )
}


