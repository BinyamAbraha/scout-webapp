"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Star, MapPin, Search, User } from "lucide-react"

const foodCategories = ["Chinese", "Mexican", "Breakfast", "Burger", "Pizza", "Coffee"]

const cities = ["San Francisco", "Los Angeles", "New York City"]

const foodImages = ["/burger-fries.jpg", "/gourmet-burger.jpg", "/steak-vegetables.jpg", "/pancakes-breakfast.jpg"]

export default function ScoutHomepage() {
  const [selectedCity, setSelectedCity] = useState("San Francisco")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [venues, setVenues] = useState<{
    id: number
    name: string
    rating: number
    categories: string
    address: string
    price_level?: number
  }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % foodImages.length)
    }, 4000) // Change image every 4 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    async function fetchVenues() {
      setLoading(true)
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('city', selectedCity)
        .order('rating', { ascending: false })
        .limit(6)

      if (error) {
        console.error('Error fetching venues:', error)
      } else {
        setVenues(data || [])
      }
      setLoading(false)
    }

    fetchVenues()
  }, [selectedCity])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-bold text-black">Scowt</span>
              <Image src="/binoculars-logo.png" alt="Scowt Logo" width={32} height={32} className="w-8 h-8" />
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-black hover:text-gray-600 font-medium transition-colors">
                Discover
              </a>
              <a href="#" className="text-black hover:text-gray-600 font-medium transition-colors">
                Lists
              </a>
              <a href="#" className="text-black hover:text-gray-600 font-medium transition-colors">
                Categories
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="hidden sm:flex text-black hover:bg-gray-100">
                Lists
              </Button>
              <Button size="sm" className="bg-sky-500 hover:bg-sky-600 text-white">
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Rotating Food Photos */}
          <div className="relative h-96 mb-8 rounded-2xl overflow-hidden">
            <div className="absolute inset-0">
              <Image
                src={foodImages[currentImageIndex] || "/placeholder.svg"}
                alt="Delicious food"
                fill
                className="object-cover transition-opacity duration-1000"
                priority
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>

            {/* Photo indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {foodImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentImageIndex ? "bg-white" : "bg-white bg-opacity-50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* City Selector and Search - moved down with spacing */}
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-sky-500" />
                <span className="text-black font-medium">Exploring in:</span>
              </div>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-48 bg-white border-gray-300 focus:border-sky-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search restaurants, cuisines, or dishes..."
                className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100 bg-white text-black"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Food Categories */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-black text-center mb-8">Browse by Cuisine</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {foodCategories.map((category) => (
              <Button
                key={category}
                className="h-16 bg-sky-500 hover:bg-sky-600 text-white font-medium transition-all duration-200 hover:scale-105"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated Venues */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Top Rated in {selectedCity}</h2>
            <p className="text-gray-600 text-lg">Discover the highest-rated restaurants and cafés in your area</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="group bg-white border-gray-200">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                    </div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              venues.map((venue, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-gray-200"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src="/placeholder.svg"
                      alt={venue.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 flex items-center space-x-1 shadow-md">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold text-black">{venue.rating}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-black mb-2">{venue.name}</h3>
                    <p className="text-gray-600 font-medium">{venue.categories}</p>
                    <p className="text-sm text-gray-500 mt-2">{venue.address}</p>
                    {venue.price_level && (
                      <span className="text-green-600 mt-2 block">{'$'.repeat(venue.price_level)}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
            )}
          </div>

          <div className="text-center mt-12">
            <Button className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 text-lg">View All Restaurants</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl font-bold text-white">Scowt</span>
                <Image src="/binoculars-logo.png" alt="Scowt Logo" width={24} height={24} className="w-6 h-6" />
              </div>
              <p className="text-gray-300 mb-4">
                Discover amazing food experiences in your city. From hidden gems to popular favorites, Scowt helps you
                find your next great meal.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Discover</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Restaurants
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cafés
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Bars
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Food Trucks
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Scowt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
