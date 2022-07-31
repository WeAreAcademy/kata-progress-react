import {
    Box, Checkbox, Input, Link, Table, TableCaption, TableContainer, Tbody, Td, Text, Th, Thead, Tooltip, Tr, useToast
} from "@chakra-ui/react";
import axios from "axios";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { sortDecoratedKatas } from "./kataUtils";
import { LoggedInUser } from "./LoggedInUser";
import { DecoratedKata, Kata, KataProgressData, SimpleUserWithCounts } from "./types";

interface KataProgressAppProps {
    user: User;
    isFaculty: boolean;
}

const apiBaseURL = process.env.NODE_ENV === "production"
    ? "https://academy-kata-progress.herokuapp.com"
    : "http://localhost:4000"


export function KataProgressApp({ user, isFaculty }: KataProgressAppProps) {
    const [katas, setKatas] = useState<Kata[]>([]);
    const [katasProgressData, setKatasProgressData] = useState<KataProgressData[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState<SimpleUserWithCounts[]>([]);
    const [selectedUser, setSelectedUser] = useState<SimpleUserWithCounts | null>(null);

    const toast = useToast()

    function handleSelectNewUser(id: string) {
        const newUser = users.find(u => u.id === id);
        console.log("setting new user: ", newUser, " given ", id)
        setSelectedUser(newUser ?? null)
    }

    useEffect(() => {
        async function fetchAndSaveUsers() {
            if (!isFaculty) {
                return;
            }
            const headers = await createAuthHeaders(user);
            const usersData = (await axios.get(`${apiBaseURL}/users_with_counts`, { headers })).data;
            console.log("setting users: ", usersData.data.users)
            setUsers(usersData.data.users);
            setSelectedUser(usersData.data.users[0])
        }
        fetchAndSaveUsers();
    }, [user, isFaculty])

    useEffect(() => {
        async function fetchAndSaveKatas() {
            const uidToFetch = selectedUser?.id ?? user.uid;
            const headers = await createAuthHeaders(user);
            const katasData = (await axios.get(`${apiBaseURL}/katas`)).data;
            const progressRes = await axios.get(`${apiBaseURL}/user/${uidToFetch}/kata_progress`, { headers });
            const progressData = progressRes.data;
            setKatas(katasData.data.katas);
            setKatasProgressData(progressData.data);
        }

        fetchAndSaveKatas();
    }, [user, selectedUser]);

    const decoratedKatas: DecoratedKata[] = calcDecoratedKatas();
    function calcDecoratedKatas() {
        return katas.map(k => {
            const progress = katasProgressData.find(pd => pd.kata_id === k.id)
            const dk: DecoratedKata = { kata: k, progress }
            dk.progress = progress;
            return dk;
        })
    }

    async function createAuthHeaders(u: User) {
        return { "Authorization": "Bearer " + await u.getIdToken() }
    }

    async function updateStatusOnKata(user_id: string, kata_id: string, newStatus: boolean) {
        console.log(`would update status on kata ${kata_id} for user: ${user_id}`)
        const headers = await createAuthHeaders(user);
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
            <LoggedInUser user={user} isFaculty={isFaculty} />
            {selectedUser && <Text>Looking at progress for {selectedUser.display_name} - {selectedUser.email}</Text>}
            <Text>{countOfDoneKatas} katas recorded as done</Text>
            <Input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder='search here...'
                size='sm'
            />
            {
                isFaculty &&
                <select onChange={(e) => handleSelectNewUser(e.target.value)}>
                    {users.map(u =>
                        <option
                            key={u.id}
                            value={u.id}
                        >
                            {u.display_name} - ({u.number_of_katas}) - {u.email}
                        </option>)}
                </select>
            }
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


