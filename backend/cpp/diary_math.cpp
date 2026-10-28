// Standalone C++17 statistical engine; no diary records leave the device by default.
// Build: g++ -std=c++17 -O2 -Wall -Wextra diary_math.cpp -o diary_math
// Input: whitespace-separated confirmed start dates YYYY-MM-DD on stdin.
// Output: JSON summary on stdout. No networking, storage, or external dependencies.
#include <algorithm>
#include <cmath>
#include <iomanip>
#include <iostream>
#include <numeric>
#include <sstream>
#include <string>
#include <vector>
using namespace std;
int64_t civil_days(int y,unsigned m,unsigned d){
 y-=m<=2; const int era=(y>=0?y:y-399)/400;const unsigned yoe=unsigned(y-era*400);
 const unsigned doy=(153*(m+(m>2?-3:9))+2)/5+d-1;const unsigned yoe_days=yoe*365+yoe/4-yoe/100;
 return int64_t(era)*146097+int64_t(yoe_days+doy)-719468;
}
bool parse(const string& s,int64_t& days){
 if(s.size()!=10||s[4]!='-'||s[7]!='-')return false;
 for(size_t i=0;i<s.size();++i)if(i!=4&&i!=7&&(s[i]<'0'||s[i]>'9'))return false;
 int y=stoi(s.substr(0,4)),m=stoi(s.substr(5,2)),d=stoi(s.substr(8,2));
 if(y<1900||y>2200||m<1||m>12||d<1)return false;
 static const int lengths[]={31,28,31,30,31,30,31,31,30,31,30,31};
 int maxd=lengths[m-1]+(m==2&&((y%4==0&&y%100!=0)||y%400==0));
 if(d>maxd)return false;days=civil_days(y,m,d);return true;
}
int main(){
 vector<int64_t> starts;string s;while(cin>>s){int64_t d;if(!parse(s,d)){cerr<<"Invalid ISO date: "<<s<<"\n";return 2;}starts.push_back(d);}
 sort(starts.begin(),starts.end());starts.erase(unique(starts.begin(),starts.end()),starts.end());
 vector<double> v;int excluded=0;
 for(size_t i=1;i<starts.size();++i){double gap=double(starts[i]-starts[i-1]);if(gap>=15&&gap<=90)v.push_back(gap);else ++excluded;}
 const size_t n=v.size();const double mean=n?accumulate(v.begin(),v.end(),0.0)/n:0;
 vector<double> sorted=v;sort(sorted.begin(),sorted.end());
 double median=n?(sorted[(n-1)/2]+sorted[n/2])/2:0;
 double variance=0;for(double x:v)variance+=(x-mean)*(x-mean);
 const double sd=n>1?sqrt(variance/(n-1)):0;
 cout<<fixed<<setprecision(4)<<"{\"starts\":"<<starts.size()<<",\"count\":"<<n<<",\"excluded\":"<<excluded<<",\"intervals\":[";
 for(size_t i=0;i<n;++i){if(i)cout<<",";cout<<v[i];}cout<<"],\"mean\":";
 if(n)cout<<mean;else cout<<"null";cout<<",\"median\":";
 if(n)cout<<median;else cout<<"null";cout<<",\"sd\":";
 if(n>1)cout<<sd;else cout<<"null";cout<<",\"cv\":";
 if(n>1&&mean)cout<<sd/mean;else cout<<"null";
 cout<<",\"min\":";if(n)cout<<sorted.front();else cout<<"null";
 cout<<",\"max\":";if(n)cout<<sorted.back();else cout<<"null";cout<<"}\n";
}
