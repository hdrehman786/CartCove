import { createSlice } from "@reduxjs/toolkit";


const intialValue = {
    allCategory : [],
    subCategory : [],
    product : []
}

const productSlice = createSlice({
    name : 'product',
    initialState : intialValue,
    reducers : {
        setAllCategory : (state, action) =>{
            state.allCategory = [...action.payload];
        },
        setSubCategory : (state, action) => {
            state.subCategory = [...action.payload];
        }
    }
})

export const { setAllCategory, setSubCategory } = productSlice.actions;

export default productSlice.reducer;