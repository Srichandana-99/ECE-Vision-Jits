
import { MapPin, Building, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const PlacementHighlights = () => {
  const placementStats = [
    { label: "Students Placed", value: "156", icon: TrendingUp, color: "text-green-600" },
    { label: "Companies Visited", value: "45", icon: Building, color: "text-blue-600" },
    { label: "Average Package", value: "8.5 LPA", icon: TrendingUp, color: "text-purple-600" },
    { label: "Highest Package", value: "28 LPA", icon: TrendingUp, color: "text-orange-600" }
  ];

  const recentPlacements = [
    {
      name: "Rajesh Kumar",
      company: "Google India",
      package: "28 LPA",
      location: "Bangalore",
      date: "Jan 2024"
    },
    {
      name: "Ananya Singh",
      company: "Microsoft",
      package: "24 LPA",
      location: "Hyderabad",
      date: "Jan 2024"
    },
    {
      name: "Vikram Reddy",
      company: "Amazon",
      package: "22 LPA",
      location: "Chennai",
      date: "Dec 2023"
    },
    {
      name: "Priyanka Sharma",
      company: "TCS Innovation Lab",
      package: "12 LPA",
      location: "Pune",
      date: "Dec 2023"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Placement Highlights
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our students are achieving remarkable success in top companies worldwide
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {placementStats.map((stat, index) => (
            <Card key={index} className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Recent Success Stories
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {recentPlacements.map((placement, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900">{placement.name}</h4>
                      <div className="flex items-center text-gray-600 mt-1">
                        <Building className="h-4 w-4 mr-2" />
                        {placement.company}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{placement.package}</div>
                      <div className="text-sm text-gray-500">{placement.date}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {placement.location}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlacementHighlights;
