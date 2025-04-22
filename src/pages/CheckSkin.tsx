
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CheckSkinMain } from "@/components/checkskin/CheckSkinMain";

const CheckSkin = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Check Your Skin
            </h1>
            <p className="text-lg text-gray-600">
              Upload a photo of your skin concern and get instant AI-powered analysis and recommendations.
            </p>
          </div>
          <CheckSkinMain />
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default CheckSkin;
