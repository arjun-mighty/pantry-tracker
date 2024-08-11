'use client'
import { useEffect, useState } from "react"
import { deleteDoc, setDoc, doc, collection, getDoc, getDocs } from "firebase/firestore"
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material"
import { firestore } from "@/Firebase"
import {motion} from "framer-motion" 


function App(){
    const [ShowHome, setShowHome]= useState(false)

    const handleStart = () => {
        setShowHome(true)
    }
 
return (
        <>
          {!ShowHome? (
            <WelcomeScreen onStart={handleStart} />
          ) : (
            <Home />
          )}
        </>
      )
}
function WelcomeScreen({onStart}){
    return(
        <Box 
        width = "100vw"
        heigh= "100vh"
        display = "flex"
        flexDirection = "column"
        justifyContent = "center"
        alignItems="center"
        sx={{
          position: 'relative', 
          overflow: 'hidden',  
      }}
      >
        <motion.div
        initial={{ opacity: 0, x: -20 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 3 }}
        >
          <Typography variant = "h2" color= "#333" textAlign="center" >
            Welcome to the Inventory Tracker!
           </Typography>
        </motion.div>

        <Button variant="contained" onClick={onStart}  sx={{ mt: 3 }}>
            Get Started
        </Button>
     </Box>
    )
}
 function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState(" ")
  const [searchQuery, setSearchQuery] = useState(" ")
  const [searchResult, setSearchResult] = useState([])

  const updateInventory = async () => {
    const snapshot = await getDocs(collection(firestore, "inventory"))
    const inventoryList = [];
    snapshot.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }

    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }

    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleSearch = () => {
    const result = inventory.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setSearchResult(result)
 }

return (
  <Box
   width="100vw"
  height="100vh"
  display="flex"
  flexDirection="column"
  justifyContent="center"
  alignItems="center"
  position="relative"
  gap={2}>
    <Modal open={open} onClose={handleClose}>
      <Box
      position="absolute"
      top="50%"
      left="50%"
      width={400}
      bgcolor="lightblue"
      border="2px solid #000"
      boxShadow={24}
      p={4}
      display="flex"
      flexDirection="column"
      gap={3}
      sx={{
        transform: "translate(-50%, -50%)",
          }}
     >
      
      <Typography variant="h6">Add Item</Typography>
       <Stack width="100%" direction="row" spacing={2}>
        <TextField
        variant="outlined"
        fullWidth
        value={itemName}
        onChange={(e) => {
          setItemName(e.target.value)
        }}
        />
       <Button
        variant="outlined"
        onClick={() => {
        addItem(itemName)
        setItemName(" ")
        handleClose()
        }}
       >
          Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={() =>{
        handleOpen()
      }}
      >
        Add New Item
      </Button>
      <Box position="absolute" top={16} right={16} display="flex" alignItems="center" gap={2}>
        <TextField
          border = "3px solid #333"
          variant="outlined"
          placeholder="Search items"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Box>
      <Box border="3px solid #333" mt={2} width="800px">
        <Box
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h2" color="#333">
            Inventory Items
          </Typography>
        </Box>
        <Stack
          height="400px"
          spacing={2}
          overflow="auto"
        >
          {(searchResult.length > 0 ? searchResult : inventory).map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f0f0f0"
              padding={5}
            >
              <Typography variant="h3" color="#333" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>

              <Typography variant="h3" color="#333" textAlign="center">
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={() => addItem(name)}>
                  Add
                </Button>
                <Button variant="contained" onClick={() => removeItem(name)}>
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
        
      </Box>
    </Box>
  );
}
export default App 
