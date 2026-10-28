// Emscripten browser bridge; arithmetic runs entirely on the device.
// em++ -O3 -std=c++17 -s WASM=1 -s MODULARIZE=1 -s EXPORT_ES6=1
// -s ENVIRONMENT=web -s EXPORTED_FUNCTIONS='["_cycle_stats","_malloc","_free"]'
// -s EXPORTED_RUNTIME_METHODS='["cwrap"]' -o diary_wasm.js diary_wasm.cpp
#include <cmath>
#include <cstddef>
#include <algorithm>
#include <vector>
#include <numeric>
extern "C" {
// Accept prevalidated chronological cycle intervals; return count,mean,median,sd,min,max,cv.
void cycle_stats(const double* input,int n,double* out){
 if(!out)return;
 for(int i=0;i<7;i++)out[i]=NAN;
 if(!input||n<=0)return;
 std::vector<double> v;
 for(int i=0;i<n;i++)if(std::isfinite(input[i])&&input[i]>=15&&input[i]<=90)v.push_back(input[i]);
 if(v.empty()){out[0]=0;return;}
 std::sort(v.begin(),v.end());double sum=std::accumulate(v.begin(),v.end(),0.0),mean=sum/v.size();
 double sq=0;for(double x:v)sq+=(x-mean)*(x-mean);
 double sd=v.size()>1?std::sqrt(sq/(v.size()-1)):NAN;
 out[0]=v.size();out[1]=mean;out[2]=(v[(v.size()-1)/2]+v[v.size()/2])/2;
 out[3]=sd;out[4]=v.front();out[5]=v.back();out[6]=std::isfinite(sd)&&mean>0?sd/mean:NAN;
}
}
