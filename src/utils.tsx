
type endCallback = (didEnd: boolean, errorMsg: string) => void;
const VOTESTORAGE = "VOTE_STORAGE";
const BACKEND_URL = "https://basic-would-you-rather-api.vercel.app";

// Request rathers to the back-end
export async function getRathers(rathers_offset: number, endCallback: endCallback) {
  try {
    const url = `${BACKEND_URL}/rathers/get/${rathers_offset}`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status == 400) {
        const data = await response.json();
        throw new Error(data.message);
      } 
      else {
        throw new Error(`Request status ${response.status}.`);
      }
    }

    const to_json = await response.json();

    // Check if valid request
    if (!to_json.isSuccess) {
      throw new Error(to_json.message);
    }

    return to_json.rathers;
  } catch (err) {
    console.error(String(err));
    
    if (String(err) === "Error: You're skipping too much fam")
    {
      endCallback(true, "This is the end. Follow me in github 'Banacount'.");
    }

    return false;
  }
}

// Request to add a new wyr scenario
export async function requestAdd (left: string, right: string) {
  try {
    const url = encodeURI(`${BACKEND_URL}/rathers/request_add_rather?left_rather=${left}&right_rather=${right}`);
    const response = await fetch(url);

    if (!response.ok) {
      const data = await response.json();
      if (data.message && data.timeRemaining) 
      {
        const timeRemaining  = {
          Minutes: (data.timeRemaining*60),
          Seconds: ((data.timeRemaining*60)*60) % 60,
        }
        timeRemaining.Minutes = Math.trunc(timeRemaining.Minutes);
        timeRemaining.Seconds = Math.trunc(timeRemaining.Seconds);

        alert(`${data.message}\n${timeRemaining.Minutes}min and ${timeRemaining.Seconds}sec left.`);
        return;
      } 
      if (data.message) 
        throw new Error(data.message);
      else 
        throw new Error("Can't contact the server.");
    }

    const data = await response.json();
    if (data.message)
      alert(data.message)
    return 0;
  } catch (err) {
    alert(String(err));
    return 1;
  }
}

// Request to add a vote in the back-end
export async function addVoteToServer(id_index: number, direction: string): Promise<boolean> {
  try {
    const url = `https://basic-would-you-rather-api.vercel.app/rathers/vote/${direction}/${id_index}`;
    const response = await fetch(url, { method: "POST" });

    if (!response.ok) {
      if (response.status == 400) {
        const data = await response.json();
        throw new Error(data.message);
      } 
      else {
        throw new Error(`Request status ${response.status}.`);
      }
    }

    const to_json = await response.json();

    // Check if valid request
    if (!to_json.isSuccess) {
      throw new Error(to_json.message);
    }

    return true;
  } catch (err) {
    console.error(String(err));
    return false
  }
}

// Save voted list locally
export function saveVotedList(voted_list: number[]) {
  localStorage.setItem(VOTESTORAGE, JSON.stringify(voted_list));
}

// Get voted list in local storage
export function getVotedList(): number[] {
  let getList = localStorage.getItem(VOTESTORAGE);

  if (getList === null) {
    saveVotedList([]);
    return [];
  } else {
    return JSON.parse(getList);
  }
}

// Others
export const calcOperation = (input: number) => {
  if (Number.isNaN(input)) 
    return 0;
  else if (Math.trunc(input) - input != 0) 
  {
    const format = parseFloat(input.toFixed(2))
    return format;
  }
  else 
    return Math.trunc(input);
};
