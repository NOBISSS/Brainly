import { BACKEND_URL } from "@/config"
import axios from "axios"

export const sendContactMessage = async (data: {
  name: string
  email: string
  message: string
}) => {
  return axios.post(BACKEND_URL+"api/v1/users/contact",data)
}
