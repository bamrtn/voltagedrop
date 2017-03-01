#include "fraction.h"
//#include <iostream>
#include <vector>

using namespace std;

class gauss{
public:
  vector<vector<fraction> > in;
  //ector<vector<fraction> > out;
  vector<float> out;
  int num = 0;
  void reset(){
    in.resize(0);
    out.resize(0);
  }
  gauss(){reset();}
  void setVariableNum(int a){
    reset();
    num = a;
  }
  void addEquation(vector<fraction>& e){
    in.resize(in.size()+1);
    for (int i = 0; i<num+1; i++){
      in[in.size()-1].push_back(e[i]);
    }
  }

  int calc(){
    out.resize(in.size());
    int cEq = 0;
    bool undef = false;
    for (int cVar=0; cVar<num&&cEq<in.size(); cVar++){
      int tEq = cEq;
      while (tEq<in.size()&&in[tEq][cVar]==0) tEq++;
      if (tEq<in.size()){
        if (tEq != cEq) swap(in[tEq],in[cEq]);
        fraction rat = fraction(1)/in[cEq][cVar];
        for (int tVar = cVar; tVar<num+1; tVar++){
          in[cEq][tVar]=in[cEq][tVar]*rat;
        }
        for (tEq = cEq+1; tEq<in.size(); tEq++){
          if (in[tEq][cVar]!=0){
            rat = fraction(-1)*in[tEq][cVar];
            for (int tVar = cVar; tVar<num+1; tVar++){
              in[tEq][tVar]=in[tEq][tVar]+in[cEq][tVar]*rat;
            }
          }
        }
        for (tEq = cEq-1; tEq>=0; tEq--){
          if (in[tEq][cVar]!=0){
            rat = fraction(-1)*in[tEq][cVar];
            for (int tVar = cVar; tVar<num+1; tVar++){
              in[tEq][tVar]=in[tEq][tVar]+in[cEq][tVar]*rat;
            }
          }
        }
        cEq++;
      }else{
        undef=true;
      }
    }
    if (undef){
     // cout<<"Variables not defined!"<<endl;
      return 0;
    }
    bool e=true;
    for (int i=cEq; i<in.size()&&e; i++) {
        if (in[i][num]!=0) e=false;
    }
    if (!e){
     // cout<<"Contradiction!"<<endl;
      return 0;
    }
    return 1;
  }

  vector<float> solve(){
    out.resize(0);
    for (int i=0; i<num; i++){
        out.push_back((in[i][num].sign?in[i][num].num/in[i][num].denom:in[i][num].num/in[i][num].denom*-1));
    }
    return out;
  }
};
