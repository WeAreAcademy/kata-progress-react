import {
  Box, ChakraProvider, Grid,
  theme
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { KataProgressApp } from "./KataProgressApp"

export const App = () => (
  <ChakraProvider theme={theme}>
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />
        <KataProgressApp />

      </Grid>
    </Box>
  </ChakraProvider>
)
