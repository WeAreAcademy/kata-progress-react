import {
  Box, Button, ChakraProvider, Grid,
  Heading, theme
} from "@chakra-ui/react";

import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { KataProgressApp } from "./KataProgressApp";

import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User } from "firebase/auth";
import React, { useEffect } from "react";
import { app } from "./configFirebase";

const auth = getAuth(app);

export const App = () => {
  const [user, setUser] = React.useState<User | null>(null)
  useEffect(() => {
    const desub = auth.onAuthStateChanged((u) => {
      setUser(u);
    })
    return desub;
  }, []);

  function handleLogInClick() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(getAuth(), provider)
  }
  function handleLogOutClick() {
    signOut(getAuth());
  }

  return (<ChakraProvider theme={theme}>
    <Box textAlign="center" fontSize="xl">
      <Heading>Kata Progress</Heading>
      {!user && <Button onClick={handleLogInClick}>Log in with google</Button>}
      {user && <Button onClick={handleLogOutClick}>Log out</Button>}
      <Grid minH="100vh" p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />

        {user && <KataProgressApp user={user} />}

      </Grid>
    </Box>
  </ChakraProvider>
  )
}
