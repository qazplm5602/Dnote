export const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};

export const randomString = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const dateFormat = function(date: Date): string {
  const formatDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}`;
  const isPm = date.getHours() >= 12;
  const ampm = `오${isPm ? "후" : "전"}`;
  const clock = `${(date.getHours() - (isPm ? 12 : 0)).toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

  return `${formatDate} ${ampm} ${clock}`;
}

export const dateFormatNumber = function(date: Date) {
  return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2,'0')}.${date.getDate().toString().padStart(2,'0')}`;
}

export const numberToKorean = function(value: number): string {
  if (value >= 10000) {
    return `${numberWithCommas(Math.round((value / 10000) * 10) / 10)}만`;
  } if (value >= 1000) {
    return `${Math.round((value / 1000) * 10) / 10}천`;
  }

  return value.toString();
}

export function numberWithCommas(x: number) { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

export type aliveType = {
  alive: boolean
}