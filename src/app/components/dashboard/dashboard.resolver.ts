import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ChartConfiguration } from 'chart.js';

export interface ActivityItem {
  id: number;
  user: {
    name: string;
    avatar: string;
    role: string;
  };
  activity: string;
  date: string;
  status: string;
}

export interface Template {
  title: string;
  description: string;
  icon: string;
  color: 'primary' | 'success' | 'warning' | 'info';
  lastUsed: string;
  image: string;
  label: string;
}

export interface StorageData {
  pieChartData: ChartConfiguration<'pie'>['data'];
}

export interface RevenueData {
  lineChartData: ChartConfiguration<'line'>['data'];
  periods: string[];
}

export interface TrafficItem {
  platform: string;
  value: number;
  color: string;
}

export interface PlatformReachData {
  barChartData: ChartConfiguration<'bar'>['data'];
}

export interface DashboardData {
  statsCards: {
    title: string;
    value: string;
    change: number;
    changeText: string;
    isPositive: boolean;
  }[];
  activities: ActivityItem[];
  templates: Template[];
  storageData: StorageData;
  revenueData: RevenueData;
  trafficData: TrafficItem[];
  platformReachData: PlatformReachData;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardResolver implements Resolve<DashboardData> {
  resolve(): Observable<DashboardData> {
    // In a real application, this would be an HTTP call to your backend
    return of({
      statsCards: [
        {
          title: 'Total Users',
          value: '2,420',
          change: 6,
          changeText: 'active users',
          isPositive: true
        },
        {
          title: 'Clubs',
          value: '1,210',
          change: 10,
          changeText: 'new clubs',
          isPositive: false
        },
        {
          title: 'Players',
          value: '316',
          change: 20,
          changeText: 'active players',
          isPositive: true
        }
      ],
      activities: [
        {
          id: 1,
          user: {
            name: 'John Doe',
            avatar: 'assets/avatars/john.jpg',
            role: 'Club Manager'
          },
          activity: 'Big WIN! Send Final (Facebook, Instagram)',
          date: 'Apr 27, 2025',
          status: 'Published'
        },
        {
          id: 2,
          user: {
            name: 'Cathy Martinez',
            avatar: 'assets/avatars/cathy.jpg',
            role: 'Team Coach'
          },
          activity: 'Big WIN! Send Final (Facebook, Instagram)',
          date: 'Apr 27, 2025',
          status: 'Draft'
        },
        {
          id: 3,
          user: {
            name: 'Joshua Jones',
            avatar: 'assets/avatars/joshua.jpg',
            role: 'Club Admin'
          },
          activity: 'Big WIN! Send Final (Facebook, Instagram)',
          date: 'Apr 27, 2025',
          status: 'Published'
        },
        {
          id: 4,
          user: {
            name: 'Maria Williams',
            avatar: 'assets/avatars/maria.jpg',
            role: 'Team Manager'
          },
          activity: 'Big WIN! Send Final (Facebook, Instagram)',
          date: 'Apr 27, 2025',
          status: 'Draft'
        },
        {
          id: 5,
          user: {
            name: 'Adam Taylor',
            avatar: 'assets/avatars/adam.jpg',
            role: 'Club Admin'
          },
          activity: 'Big WIN! Send Final (Facebook, Instagram)',
          date: 'Apr 27, 2025',
          status: 'Published'
        },
        {
          id: 6,
          user: {
            name: 'Olivia Rye',
            avatar: 'assets/avatars/olivia.jpg',
            role: 'Media Specialist'
          },
          activity: 'Uploaded new team photos',
          date: 'Apr 28, 2025',
          status: 'Published'
        },
        {
          id: 7,
          user: {
            name: 'Liam Smith',
            avatar: 'assets/avatars/liam.jpg',
            role: 'Player'
          },
          activity: 'Updated player profile',
          date: 'Apr 29, 2025',
          status: 'Draft'
        },
        {
          id: 8,
          user: {
            name: 'Emma Brown',
            avatar: 'assets/avatars/emma.jpg',
            role: 'Coach'
          },
          activity: 'Shared training schedule',
          date: 'Apr 30, 2025',
          status: 'Published'
        },
        {
          id: 9,
          user: {
            name: 'Noah Wilson',
            avatar: 'assets/avatars/noah.jpg',
            role: 'Team Manager'
          },
          activity: 'Added new player to roster',
          date: 'May 1, 2025',
          status: 'Draft'
        },
        {
          id: 10,
          user: {
            name: 'Sophia Lee',
            avatar: 'assets/avatars/sophia.jpg',
            role: 'Club Admin'
          },
          activity: 'Scheduled friendly match',
          date: 'May 2, 2025',
          status: 'Published'
        }
      ],
      templates: [
        {
          title: 'BIG MATCH',
          description: 'Template for major tournament matches',
          icon: 'sports_soccer',
          color: 'primary',
          lastUsed: '2 days ago',
          image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
          label: 'Recent'
        },
        {
          title: 'PLAY BALL',
          description: 'Template for friendly matches',
          icon: 'sports',
          color: 'warning',
          lastUsed: '1 week ago',
          image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=400&q=80',
          label: 'Most Popular'
        },
        {
          title: 'RED TEAM VS BLUE TEAM',
          description: 'Template for team competitions',
          icon: 'groups',
          color: 'info',
          lastUsed: '3 days ago',
          image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
          label: "User's Choice"
        }
      ],
      storageData: {
        pieChartData: {
          labels: ['Used by Media', 'Used by Stats', 'Used by Players', 'Free'],
          datasets: [
            {
              data: [25, 20, 15, 40],
              backgroundColor: [
                '#3B82F6',  // Blue
                '#10B981',  // Green
                '#F59E0B',  // Yellow
                '#D1D5DB'   // Gray
              ],
              hoverBackgroundColor: [
                '#2563EB',
                '#059669',
                '#D97706',
                '#9CA3AF'
              ],
              borderWidth: 0
            }
          ]
        }
      },
      revenueData: {
        lineChartData: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
          datasets: [
            {
              data: [65, 70, 80, 75, 95, 90, 110, 105, 120, 125],
              label: 'Revenue',
              fill: true,
              tension: 0.4,
              borderColor: 'rgb(0, 185, 112)',
              backgroundColor: 'rgba(0, 185, 112, 0.1)',
              pointBackgroundColor: 'rgb(0, 185, 112)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgb(0, 185, 112)'
            }
          ]
        },
        periods: ['Current Month', 'Last Month', 'Last 3 Months', 'Last 6 Months', 'Year to Date', 'All Time']
      },
      trafficData: [
        { platform: 'Instagram', value: 35, color: '#E1306C' },
        { platform: 'Facebook', value: 28, color: '#4267B2' },
        { platform: 'Twitter', value: 22, color: '#1DA1F2' },
        { platform: 'YouTube', value: 15, color: '#FF0000' }
      ],
      platformReachData: {
        barChartData: {
          labels: ['Facebook', 'Instagram', 'Twitter', 'WhatsApp'],
          datasets: [
            {
              data: [65, 120, 80, 150],
              backgroundColor: [
                '#4267B2',  // Facebook blue
                '#E1306C',  // Instagram pink
                '#1DA1F2',  // Twitter blue
                '#25D366'   // WhatsApp green
              ],
              borderRadius: 5,
              maxBarThickness: 30,
              borderWidth: 0,
              hoverBackgroundColor: [
                '#365899',  // Darker Facebook blue
                '#C13584',  // Darker Instagram pink
                '#1A91DA',  // Darker Twitter blue
                '#128C7E'   // Darker WhatsApp green
              ]
            }
          ]
        }
      }
    });
  }
} 