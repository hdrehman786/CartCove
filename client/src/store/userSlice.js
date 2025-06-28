

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    _id:"",
    name:"",
    email:"",
    avatar:"",
    mobile:"",
    address:"",
    role:"",
    verify_email:"",
    last_login_date:"",
    status:"",
    address_details:[],
    shopping_cart:[],
    orderHistory:[],
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        settUserDetails : (state,action) => {
            state.name =action.payload.name,
            state.email =action.payload.email,
            state._id =action.payload._id,
            state.avatar =action.payload.avatar,
            state.mobile =action.payload.mobile,
            state.address =action.payload.address,
            state.role =action.payload.role,
            state.verify_email =action.payload.verify_email,
            state.last_login_date =action.payload.last_login_date,
            state.status =action.payload.status,
            state.address_details =action.payload.address_details,
            state.shopping_cart =action.payload.shopping_cart,
            state.orderHistory =action.payload.orderHistory
        },
        logout : (state,action) => {
            state.name =""
            state.email =""
            state._id =""
            state.avatar =""
            state.mobile =""
            state.address =""
            state.role =""
            state.verify_email =""
            state.last_login_date =""
            state.status =""
            state.address_details =[]
            state.shopping_cart =[]
            state.orderHistory =[]
        }
    }
})


export const { settUserDetails, reducer,logout } = userSlice.actions;

export default userSlice.reducer;












// {
//     if(user._id) {
//       return (
//         <button className=' text-neutral-800 block lg:hidden hover:cursor-pointer'>
//         <FaRegUserCircle size={25} />
//       </button>
//       )
//     } else {
//       return (
//           <button onClick={redirectToLogin} className=' text-neutral-800 block lg:hidden hover:cursor-pointer'>
//           <FaRegUserCircle size={25} />
//         </button>
//       )
//   }
//   }
