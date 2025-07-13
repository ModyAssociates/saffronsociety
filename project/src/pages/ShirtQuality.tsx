import { motion } from 'framer-motion';
import { useState } from 'react';

const ShirtQuality = () => {
  const [activeUnit, setActiveUnit] = useState<'imperial' | 'metric'>('imperial');

  return (
    <div className="container-custom py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="font-playfair text-3xl md:text-4xl font-bold text-maroon mb-8">
          Ultra Cotton Tee Quality
        </h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          <section className="mb-8">
            <h2 className="font-playfair text-2xl font-bold text-neutral-800 mb-4">About</h2>
            <p className="text-neutral-700">
              This unisex ultra cotton tee is a classic. Quality cotton construction means that designs are sure to shine. 
              The shoulders are tapped for a good upper-body fit. There are no side seams, ensuring a clean, unbroken flow. 
              The collar has ribbed knitting for improved elasticity. The materials that went into this product are sustainably 
              sourced and economically friendly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-playfair text-2xl font-bold text-neutral-800 mb-4">Key Features</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-neutral-800 mb-2">Without side seams</h3>
                <p className="text-neutral-700">Knitted in one piece using tubular knit, it reduces fabric waste and makes the garment more attractive</p>
              </div>
              <div>
                <h3 className="font-bold text-neutral-800 mb-2">Ribbed knit collar without seam</h3>
                <p className="text-neutral-700">Ribbed knit makes the collar highly elastic and helps retain its shape</p>
              </div>
              <div>
                <h3 className="font-bold text-neutral-800 mb-2">Shoulder tape</h3>
                <p className="text-neutral-700">Twill tape covers the shoulder seams to stabilize the back of the garment and prevent stretching</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="font-playfair text-2xl font-bold text-neutral-800 mb-4">Specifications</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-neutral-800 mb-2">Fiber composition</h3>
                <p className="text-neutral-700">Solid colors are 100% cotton; Heather colors are 50% cotton, 50% polyester (Sport Grey is 90% cotton, 10% polyester); Antique colors are 90% cotton, 10% polyester</p>
              </div>
              <div>
                <h3 className="font-bold text-neutral-800 mb-2">Fabric</h3>
                <p className="text-neutral-700">Environmentally-friendly manufactured cotton that gives thicker vintage feel to the shirt. Long-lasting garment suitable for everyday use. The "Natural" color is made with unprocessed cotton, which results in small black flecks throughout the fabric</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="font-playfair text-2xl font-bold text-neutral-800 mb-4">Care Instructions</h2>
            <ul className="list-disc list-inside text-neutral-700 space-y-2">
              <li>Machine wash: cold (max 30C or 90F)</li>
              <li>Non-chlorine: bleach as needed</li>
              <li>Do not tumble dry</li>
              <li>Do not iron</li>
              <li>Do not dryclean</li>
            </ul>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-bold text-neutral-800 mb-4">Size Guide</h2>
            
            {/* Tab buttons */}
            <div className="flex gap-1 mb-4">
              <button
                onClick={() => setActiveUnit('imperial')}
                className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                  activeUnit === 'imperial'
                    ? 'bg-orange-500 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Imperial (in)
              </button>
              <button
                onClick={() => setActiveUnit('metric')}
                className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                  activeUnit === 'metric'
                    ? 'bg-orange-500 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Metric (cm)
              </button>
            </div>

            <div className="overflow-x-auto">
              {activeUnit === 'imperial' ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-100">
                      <th className="px-4 py-2 text-left">Size</th>
                      <th className="px-4 py-2 text-center">S</th>
                      <th className="px-4 py-2 text-center">M</th>
                      <th className="px-4 py-2 text-center">L</th>
                      <th className="px-4 py-2 text-center">XL</th>
                      <th className="px-4 py-2 text-center">2XL</th>
                      <th className="px-4 py-2 text-center">3XL</th>
                      <th className="px-4 py-2 text-center">4XL</th>
                      <th className="px-4 py-2 text-center">5XL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 font-medium">Width (in)</td>
                      <td className="px-4 py-2 text-center">18.00</td>
                      <td className="px-4 py-2 text-center">20.00</td>
                      <td className="px-4 py-2 text-center">22.00</td>
                      <td className="px-4 py-2 text-center">24.00</td>
                      <td className="px-4 py-2 text-center">26.00</td>
                      <td className="px-4 py-2 text-center">28.00</td>
                      <td className="px-4 py-2 text-center">30.00</td>
                      <td className="px-4 py-2 text-center">32.00</td>
                    </tr>
                    <tr className="bg-neutral-50">
                      <td className="px-4 py-2 font-medium">Length (in)</td>
                      <td className="px-4 py-2 text-center">28.00</td>
                      <td className="px-4 py-2 text-center">29.00</td>
                      <td className="px-4 py-2 text-center">30.00</td>
                      <td className="px-4 py-2 text-center">31.00</td>
                      <td className="px-4 py-2 text-center">32.00</td>
                      <td className="px-4 py-2 text-center">33.00</td>
                      <td className="px-4 py-2 text-center">34.00</td>
                      <td className="px-4 py-2 text-center">35.00</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium">Sleeve length (in)</td>
                      <td className="px-4 py-2 text-center">15.62</td>
                      <td className="px-4 py-2 text-center">17.37</td>
                      <td className="px-4 py-2 text-center">18.75</td>
                      <td className="px-4 py-2 text-center">20.00</td>
                      <td className="px-4 py-2 text-center">21.50</td>
                      <td className="px-4 py-2 text-center">22.87</td>
                      <td className="px-4 py-2 text-center">24.25</td>
                      <td className="px-4 py-2 text-center">25.50</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-100">
                      <th className="px-4 py-2 text-left">Size</th>
                      <th className="px-4 py-2 text-center">S</th>
                      <th className="px-4 py-2 text-center">M</th>
                      <th className="px-4 py-2 text-center">L</th>
                      <th className="px-4 py-2 text-center">XL</th>
                      <th className="px-4 py-2 text-center">2XL</th>
                      <th className="px-4 py-2 text-center">3XL</th>
                      <th className="px-4 py-2 text-center">4XL</th>
                      <th className="px-4 py-2 text-center">5XL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 font-medium">Width (cm)</td>
                      <td className="px-4 py-2 text-center">45.72</td>
                      <td className="px-4 py-2 text-center">50.80</td>
                      <td className="px-4 py-2 text-center">55.88</td>
                      <td className="px-4 py-2 text-center">60.96</td>
                      <td className="px-4 py-2 text-center">66.04</td>
                      <td className="px-4 py-2 text-center">71.12</td>
                      <td className="px-4 py-2 text-center">76.20</td>
                      <td className="px-4 py-2 text-center">81.28</td>
                    </tr>
                    <tr className="bg-neutral-50">
                      <td className="px-4 py-2 font-medium">Length (cm)</td>
                      <td className="px-4 py-2 text-center">71.12</td>
                      <td className="px-4 py-2 text-center">73.66</td>
                      <td className="px-4 py-2 text-center">76.20</td>
                      <td className="px-4 py-2 text-center">78.74</td>
                      <td className="px-4 py-2 text-center">81.28</td>
                      <td className="px-4 py-2 text-center">83.82</td>
                      <td className="px-4 py-2 text-center">86.36</td>
                      <td className="px-4 py-2 text-center">88.90</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium">Sleeve length (cm)</td>
                      <td className="px-4 py-2 text-center">39.69</td>
                      <td className="px-4 py-2 text-center">44.13</td>
                      <td className="px-4 py-2 text-center">47.63</td>
                      <td className="px-4 py-2 text-center">50.80</td>
                      <td className="px-4 py-2 text-center">54.61</td>
                      <td className="px-4 py-2 text-center">58.10</td>
                      <td className="px-4 py-2 text-center">61.60</td>
                      <td className="px-4 py-2 text-center">64.77</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default ShirtQuality;