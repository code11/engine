import { extendTheme } from "@chakra-ui/react"
import { StyleFunctionProps } from '@chakra-ui/theme-tools'

// export const myNewTheme = extendTheme({
//     components:{
//         Tab:{
//             baseStyle: {
//                 _hover: {
//                     bg: "primary"
//                 }
//             }
            
//         } 
//     }
// });

const theme = extendTheme({
    components: {
      Tab: {
        // 1. We can update the base styles
        baseStyle: {
          fontWeight: 'bold', // Normally, it is "semibold"
        },
    
      },
    },
  })
  
  export default theme