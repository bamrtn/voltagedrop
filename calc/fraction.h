class fraction {
public:
    long long num, denom;
    bool sign;
    void simplify() {
        long long a=num,b=denom;
        while (a>0&&b>0) {
            if (a>b) a=a%b;
            else b=b%a;
        }
        if (a>b) {
            num=num/a;
            denom=denom/a;
        }
        else {
            num=num/b;
            denom=denom/b;
        }
        if (num==0&&(sign==false)) sign=true;
    }
    fraction () {};
    fraction (double a) {
        if (a>=0) {
            sign=true;
        }
        else {
            sign=false;
            a=-a;
        }
        denom=1;
        bool r=true;
        for (int i=0; i<16&&a!=long(a); i++) {
            denom=denom*10;
            a=a*int(10);
        }
        num=long(a);
        simplify();
    }
    fraction (float a) {
        if (a>=0) {
            sign=true;
        }
        else {
            sign=false;
            a=-a;
        }
        denom=1;
        bool r=true;
        for (int i=0; i<16&&a!=long(a); i++) {
            denom=denom*10;
            a=a*int(10);
        }
        num=long(a);
        simplify();
    }
    fraction (int a) {
        if (a>=0) {
            sign=true;
        }
        else {
            sign=false;
            a=-a;
        }
        denom=1;
        num=a;
    }
    fraction operator + (const fraction& a) {
        fraction b;
        b.denom=a.denom*denom;
        if (sign==a.sign) {
            b.num=num*a.denom+a.num*denom;
            if (sign) b.sign=true;
            else b.sign=false;
        }
        else {
            b.num=num*a.denom-a.num*denom;
            if (sign) {
                if (b.num>=0) {
                    b.sign=true;
                }
                else {
                    b.sign=false;
                    b.num=-b.num;
                }
            }
            else {
                if (b.num>=0) {
                    b.sign=false;
                }
                else {
                    b.sign=true;
                    b.num=-b.num;
                }
            }
        }
        b.simplify();
        return b;
    }
    fraction operator - (const fraction& a) {
        fraction b;
        b.denom=a.denom*denom;
        if (sign!=a.sign) {
            b.num=num*a.denom+a.num*denom;
            if (sign) b.sign=true;
            else b.sign=false;
        }
        else {
            b.num=num*a.denom-a.num*denom;
            if (sign) {
                if (b.num>=0) {
                    b.sign=true;
                }
                else {
                    b.sign=false;
                    b.num=-b.num;
                }
            }
            else {
                if (b.num>=0) {
                    b.sign=false;
                }
                else {
                    b.sign=true;
                    b.num=-b.num;
                }
            }
        }
        b.simplify();
        return b;
    }
    fraction operator * (const fraction& a) {
        fraction b;
        b.num=num*a.num;
        b.denom=denom*a.denom;
        if (sign==a.sign) b.sign=true;
        else b.sign=false;
        b.simplify();
        return b;
    }
    fraction operator / (const fraction& a) {
        fraction b;
        b.num=num*a.denom;
        b.denom=denom*a.num;
        if (sign==a.sign) b.sign=true;
        else b.sign=false;
        b.simplify();
        return b;
    }
    bool operator == (const fraction& a) {
        if (num==a.num&&denom==a.denom&&sign==a.sign) return true;
        else return false;
    }
    bool operator != (const fraction& a) {
        if (num==a.num&&denom==a.denom&&sign==a.sign) return false;
        else return true;
    }
};
