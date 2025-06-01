import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

export default function AboutPage() {
  // State for profile modal
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  return (
    <>
      {/* Reuse the same header component */}
      <Header 
        onOpenAddItem={() => {}} 
        onOpenAddSupplier={() => {}}
        onOpenProfile={() => setIsProfileOpen(true)} 
      />
      
      <div className="container mx-auto p-6 pt-20"> {/* pt-20 to account for header height */}
        <h1 className="text-3xl font-bold mb-8 text-center">About Our Project</h1>
        
        {/* Project Description Section */}
        <section className="mb-12 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">StockDB Inventory Management System</h2>
          <p className="text-gray-700 mb-4">
            StockDB is a comprehensive inventory management system designed for e-commerce businesses. 
            Our platform provides real-time tracking of inventory levels, supplier management, 
            order processing, and reporting capabilities.
          </p>
          <p className="text-gray-700">
            The system features role-based access control, allowing administrators, staff, 
            and customers to interact with the inventory in appropriate ways while maintaining 
            data security and integrity.
          </p>
        </section>
        
        {/* Team Members Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Our Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Team Member 1 */}
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="bg-gray-200 h-60 mb-4 rounded-lg flex items-center justify-center">
                <img
                  src="https://media.licdn.com/dms/image/v2/D4D03AQFl-O_HLlA5Yg/profile-displayphoto-shrink_800_800/B4DZbOgl3hG0Ag-/0/1747221373635?e=1754524800&v=beta&t=tpLzTPS5KdzDzn_DV7NCm7QBUrkrMr-v4Gy12PmiqhQ"
                  alt="Member Photo"
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>
              <h3 className="text-xl font-medium">AbdelRahman Rahal</h3>
              <p className="text-gray-600 mb-2">Frontend Developer</p>
              <p className="text-sm text-gray-500">ID: 221001443</p>
              <p className="mt-2 text-gray-700">
                Responsible for the user interface and user experience design, 
                ensuring a seamless interaction with the system.
              </p>
            </div>
            
            {/* Team Member 2 */}
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="bg-gray-200 h-60 mb-4 rounded-lg flex items-center justify-center">
                <img
                  src="https://media.licdn.com/dms/image/v2/D4D03AQEirbgmgCV7Ew/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1722418191858?e=1754524800&v=beta&t=HkDL9wBflvYO62uJRDls4RrZ_iP_4Vw7sSPgciFnZ9E"
                  alt="Member Photo"
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>
              <h3 className="text-xl font-medium">Mahmoud Mohamed</h3>
              <p className="text-gray-600 mb-2">Database Engineer</p>
              <p className="text-sm text-gray-500">ID: 221001313</p>
              <p className="mt-2 text-gray-700">
                Manages the database architecture, ensuring data integrity and 
                efficient data retrieval for the application.
              </p>
            </div>
            
            {/* Team Member 3 */}
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="bg-gray-200 h-60 mb-4 rounded-lg flex items-center justify-center">
                <img
                  src="https://scontent.fcai19-3.fna.fbcdn.net/v/t39.30808-6/413970858_3371641342982376_7494622485291986306_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHhRIODBxgnOMsdOFx8PB_3BhTTPKWkKNMGFNM8paQo0__rltjEOwtP--Gk7TQmspjod87U9GwyKRoUpcTeHY1S&_nc_ohc=FjP9QeMfl4AQ7kNvwHogaUG&_nc_oc=AdnqQnjENoiAEIQCQcMKj-4AphF5Y0tXTI3Yg9AcH1FDz10-Jbi-g1aJysyKOMNwYBY&_nc_zt=23&_nc_ht=scontent.fcai19-3.fna&_nc_gid=g-QVtI3zzZCR-_YY90tSyA&oh=00_AfJ49Nvgscmf9hz5DHpEqi-mfrCo6CN09bAY5PGC5GFg9Q&oe=68417F02"
                  alt="Member Photo"
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>
              <h3 className="text-xl font-medium">Nour Elsharkawy</h3>
              <p className="text-gray-600 mb-2">Backend Developer</p>
              <p className="text-sm text-gray-500">ID: 221001458</p>
              <p className="mt-2 text-gray-700">
                Implements server-side logic, api, and database integration.
              </p>
            </div>
          </div>
        </section>
        
        {/* Back to Home Link */}
        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="inline-block px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}