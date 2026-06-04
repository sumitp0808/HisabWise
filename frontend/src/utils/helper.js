import {
  House,
  Plane,
  Briefcase,
  Trophy,
  Users,
  CircleHelp,
} from "lucide-react";

export function categoryIcon(category) {
  switch (category) {
    case "Home":
      return House;

    case "Trip":
      return Plane;

    case "Office":
      return Briefcase;

    case "Sports":
      return Trophy;

    case "Friends":
      return Users;

    default:
      return CircleHelp;
  }
}
// ----------------------------------------------------------------------


export function convertToCurrency(number) {
  number = Math.abs(Math.round((number  + Number.EPSILON) * 100) / 100)
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function currencyFind(currencyType){
  switch (currencyType) {
      case "INR":
          return '₹'
      case "USD":
          return '$'
      case "EUR":
          return "€"
      default:
          return '₹'
  }
}

export const monthNamesMMM = ["JAN", "FRB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];
export function getMonthMMM(expDate) {
  const date = new Date(expDate)
  return monthNamesMMM[date.getMonth()];
}

Number.prototype.zeroPad = function() {
  return ('0'+this).slice(-2);
};