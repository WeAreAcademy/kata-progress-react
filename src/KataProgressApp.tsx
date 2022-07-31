import {
    Box,
    Checkbox, Input, Link, Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr, useToast
} from "@chakra-ui/react";
import { User } from "firebase/auth"
import { useEffect, useState } from "react";
import axios from "axios"
interface Kata {
    id: string;
    url: string;
    name: string;
    status?: string;
    difficulty?: string;
    createdTime?: string;
    lastEditedTime?: string;
}
interface DecoratedKata {
    kata: Kata;
    progress?: KataProgress;
}
interface KataProgress {
    is_done: boolean;
    is_stuck: boolean;
}
interface KataProgressData {
    kata_id: string;
    user_id: string;
    is_done: boolean;
    is_stuck: boolean;
}

interface KataProgressAppProps {
    user: User;
}

export function KataProgressApp({ user }: KataProgressAppProps) {
    const [katas, setKatas] = useState<Kata[]>([]);
    const [katasProgressData, setKatasProgressData] = useState<KataProgressData[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const toast = useToast()

    useEffect(() => {
        async function fetchAndSaveKatas() {
            const katasRes = await fetch("http://localhost:4000/katas");
            const katasData = await katasRes.json();
            const progressRes = await fetch(`http://localhost:4000/user/${user.uid}/kata_progress`);
            const progressData = await progressRes.json();
            setKatas(katasData.data.katas);
            setKatasProgressData(progressData.data);
        }
        fetchAndSaveKatas();
    }, [user]);

    const decoratedKatas: DecoratedKata[] = calcDecoratedKatas();
    function calcDecoratedKatas() {
        console.log({ katasProgressData })
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
        const url = `http://localhost:4000/user/${user_id}/kata/${kata_id}/progress`
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

    function sortDecoratedKatas(ks: DecoratedKata[]): DecoratedKata[] {
        function compareTitles(a: DecoratedKata, b: DecoratedKata): -1 | 1 | 0 {
            const an = a.kata.name.toLowerCase();
            const bn = b.kata.name.toLowerCase();
            if (an < bn) {
                return -1;
            }
            if (an > bn) {
                return 1;
            }
            return 0;
        }
        function compareDifficulties(a: DecoratedKata, b: DecoratedKata): -1 | 1 | 0 {
            const da = parseInt((a.kata.difficulty ?? "0").split(" ")[0]);
            const db = parseInt((b.kata.difficulty ?? "0").split(" ")[0]);

            if (da < db) {
                return -1;
            }
            if (da > db) {
                return 1;
            }
            return compareTitles(a, b)
        }
        return [...ks].sort(compareDifficulties)

    }
    const decoratedKatasToShow = sortDecoratedKatas(decoratedKatas.filter(k => k.kata.status !== "not ready").filter(k => k.kata.name.toLowerCase().includes(searchTerm.toLowerCase())))
    const countOfDoneKatas = decoratedKatas.filter(dk => dk.progress?.is_done).length;

    return (
        <Box>
            <div>Logged in as {user.displayName} - {user.email} ({user.uid}) {
                user.photoURL && <img
                    src={user.photoURL}
                    alt={"profile of " + user.displayName}
                />
            }</div>
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
                            <Th>status</Th>
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
                                    {k.kata.status}
                                </Td>
                                <Td>
                                    <Checkbox
                                        onChange={(e) => updateStatusOnKata(user.uid, k.kata.id, e.target.checked)}
                                        isChecked={k.progress?.is_done}
                                    >done</Checkbox>
                                </Td>
                                <Td>
                                    <Link
                                        color="teal.500"
                                        href={k.kata.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >{k.kata.name}
                                    </Link>
                                </Td>
                            </Tr>


                        ))}

                    </Tbody>
                </Table>
            </TableContainer>

        </Box >
    )
}

