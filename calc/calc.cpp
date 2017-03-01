#include "gauss.h"
#include <emscripten/bind.h>
//#include <iostream>

using namespace std;


vector<fraction> temp;
vector<fraction> vtemp;
vector<vector<fraction> >g;
vector<bool> v;
vector<bool> vsources;
vector<float> out;
gauss eq;
int n;
vector<float> in;
vector<float> out2;

void vcalc(int x){
    //cout<<x<<endl;
  v[x]=true;
  for(int i=0; i<g[x].size(); i+=3){
        //cout<<"a"<<i<<endl;
    if (g[x][i+1]==0){
      vtemp[g[x][i].num]=vtemp[g[x][i].num]+fraction(1)/g[x][i+2];
      vtemp[x]=vtemp[x]-fraction(1)/g[x][i+2];
    }
    if (g[x][i+1]==1){
      if (g[x][i+2].sign){
        temp.resize(0);
        temp.resize(n+1,0);
        temp[g[x][i].num]=1;
        temp[x]=-1;
        temp[n]=g[x][i+2];
        eq.addEquation(temp);
      }
      if (!v[g[x][i].num]) vcalc(g[x][i].num);
    }
  }
}

void rcalc(int x){
  v[x]=true;
  temp.resize(0);
  temp.resize(n+1,0);
  for(int i=0; i<g[x].size(); i+=3){
    if (g[x][i+1]==0){
      temp[g[x][i].num]=temp[g[x][i].num]+fraction(1)/g[x][i+2];
      temp[x]=temp[x]-fraction(1)/g[x][i+2];
    }
  }
  eq.addEquation(temp);
  for(int i=0; i<g[x].size(); i+=3){
    if (g[x][i+1]==0){
      if (!v[g[x][i].num]) rcalc(g[x][i].num);
    }
  }
}

vector<float> calc(vector<float>& edges){
  eq.reset();
  n = 0;
  for(int i=0; i<edges.size(); i+=4){
    if (edges[i]>n) n = edges[i];
  }
  n++;
  eq.setVariableNum(n);
  g.resize(0);
  v.resize(0);
  vsources.resize(0);
  g.resize(n);
  v.resize(n);
  vsources.resize(n);
  for(int i=0; i<edges.size(); i+=4){
    g[edges[i]].push_back(edges[i+1]);
    g[edges[i]].push_back(edges[i+2]);
    if (edges[i+2] == 1){
      vsources[edges[i]] = true;
    }
    g[edges[i]].push_back(edges[i+3]);
  }
  //cout<<"asd";
  for(int i=0; i<n; i++){
    if(vsources[i]&&!v[i]){
      vtemp.resize(0);
      vtemp.resize(n+1,0);
      vcalc(i);
      //cout<<i<<endl;
      eq.addEquation(vtemp);
    }
  }
  //cout<<"asd";
  for(int i=0; i<n; i++){
    if(!v[i]) rcalc(i);
  }
  temp.resize(0);
  temp.resize(n+1,0);
  temp[0]=1;
  temp[n]=0;
  eq.addEquation(temp);
  //cout<<"asd";
  int a = eq.calc();
  out.resize(0);
  if (a) out = eq.solve(); else out.push_back(0);
  float sm = out[0];
  for (int i=0; i<out.size(); i++){
    if (out[i]<sm) sm=out[i];
  }
  for (int i=0; i<out.size(); i++){
    out[i]+=0-sm;
  }
  return out;
}

EMSCRIPTEN_BINDINGS(my_module) {
    emscripten::register_vector<float>("VectorFloat");
    emscripten::function("calc", &calc);
}
