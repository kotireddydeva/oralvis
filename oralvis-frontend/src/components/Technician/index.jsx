import { useState, useEffect } from "react"
import { FaCloudUploadAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext"
import axios from "axios"

function Technician() {
  const { user } = useAuth()
  const [patientName, setPatientName] = useState("")
  const [patientId, setPatientId] = useState("")
  const [scanType, setScanType] = useState("")
  const [region, setRegion] = useState("")
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState("")


  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!file) {
      setMessage("Please select a file to upload")
      return
    }

    const formData = new FormData()
    formData.append("patientName", patientName)
    formData.append("patientId", patientId)
    formData.append("scanType", scanType)
    formData.append("region", region)
    formData.append("file", file)

    try {
      const response = await axios.post(
        "https://oralvis-backend-sigma.vercel.app/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`, // JWT in headers
          },
        }
      )
      setMessage("Upload successful!")
    } catch (err) {
      console.error(err)
      setMessage("Upload failed")
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload Scan</h2>
      {message && <p className="text-center text-red-500 mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Patient Name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          required
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          required
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={scanType}
          onChange={(e) => setScanType(e.target.value)}
          required
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Scan Type</option>
          <option value="OPG">OPG (Orthopantomogram)</option>
          <option value="CBCT">CBCT (Cone Beam CT)</option>
          <option value="Intraoral X-Ray">Intraoral X-Ray</option>
          <option value="Cephalometric X-Ray">Cephalometric X-Ray</option>
        </select>

        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          required
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Region</option>
          <option value="Full Mouth">Full Mouth</option>
          <option value="Upper Jaw">Upper Jaw</option>
          <option value="Lower Jaw">Lower Jaw</option>
          <option value="Individual Tooth">Individual Tooth</option>
          <option value="TMJ">TMJ (Temporomandibular Joint)</option>
          <option value="Sinus">Maxillary Sinus</option>
        </select>
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-xl p-6 w-80 cursor-pointer hover:border-blue-500 transition">
          <label className="flex gap-2 items-center cursor-pointer w-full h-full">
            <FaCloudUploadAlt className="text-5xl text-blue-500 mb-3" />
            <span className="text-gray-600 mb-2 text-sm">
              {file ? file.name : "Click or Drag & Drop to Upload"}
            </span>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files[0])}
              required
              className="hidden"
            />
          </label>
        </div>
        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
          >
            Upload
          </button>
        </div>
      </form>
    </div>
  )
}

export default Technician
