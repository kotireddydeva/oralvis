import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import axios from "axios"
import jsPDF from "jspdf"

function Dentist() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchId, setSearchId] = useState("")
  const [filteredScans, setFilteredScans] = useState([])

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const response = await axios.get("http://localhost:3000/scans", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        setFilteredScans(response.data)
      } catch (err) {
        console.error(err)
        setError("Failed to load scans")
      } finally {
        setLoading(false)
      }
    }

    fetchScans()
  }, [user.token])

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/scans", {
        headers: { Authorization: `Bearer ${user.token}` },
        params: { patientId: searchId }
      });
      setFilteredScans(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load scans");
    } finally {
      setLoading(false);
    }
  }

  // --- PDF Download Logic ---
  const handleDownloadReport = async (scan) => {
    const doc = new jsPDF()

    doc.setFontSize(16)
    doc.text("Patient Scan Report", 105, 20, { align: "center" })

    doc.setFontSize(12)
    doc.text(`Patient Name: ${scan.patientName}`, 20, 40)
    doc.text(`Patient ID: ${scan.patientId}`, 20, 50)
    doc.text(`Scan Type: ${scan.scanType}`, 20, 60)
    doc.text(`Region: ${scan.region}`, 20, 70)
    doc.text(`Upload Date: ${new Date(scan.uploadDate).toLocaleString()}`, 20, 80)

    const imageData = await getBase64FromUrl(scan.imageUrl)
    if (imageData) {
      doc.addImage(imageData, "JPEG", 20, 90, 170, 120) // adjust width/height as needed
    }

    doc.save(`${scan.patientName}_scan_report.pdf`)
  }

  const getBase64FromUrl = async (url) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
    } catch (err) {
      console.error("Failed to load image for PDF", err)
      return null
    }
  }


  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Patient Health Records</h2>

      {/* Search form */}
      <form onSubmit={handleSearch} className="mb-6 flex justify-center gap-2">
        <input
          type="text"
          placeholder="Enter Patient ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
        >
          Search
        </button>
      </form>
      {loading ? <div className="max-w-sm m-auto"><p>Loading......</p></div> :
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredScans.length === 0 ? (
            <p className="text-center col-span-full text-gray-500">No scans found.</p>
          ) : (
            filteredScans.map((scan) => (
              <div
                key={scan.id}
                className="border border-gray-300 rounded-md p-4 shadow hover:shadow-lg transition"
              >
                <img
                  src={scan.imageUrl}
                  alt={`Scan of ${scan.patientName}`}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <p><strong>Patient Name:</strong> {scan.patientName}</p>
                <p><strong>Patient ID:</strong> {scan.patientId}</p>
                <p><strong>Scan Type:</strong> {scan.scanType}</p>
                <p><strong>Region:</strong> {scan.region}</p>
                <p><strong>Upload Date:</strong> {new Date(scan.uploadDate).toLocaleString()}</p>
                <div className="mt-3 flex gap-2 items-center">
                <a
                  href={scan.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition"
                >
                  View Full Image
                </a>
                <button
                  onClick={() => handleDownloadReport(scan)}
                  className="mt-3 inline-block bg-blue-500 text-white py-1 px-3 rounded hover:bg-green-600 transition cursor-pointer"
                >
                  Download Report
                </button>
                </div>
              </div>
            ))
          )}
        </div>
      }
    </div>
  )
}

export default Dentist
