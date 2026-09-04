
type endCallback = (didEnd: boolean, errorMsg: string) => void;
const VOTESTORAGE = "VOTE_STORAGE";

// Request rathers to the back-end
export async function getRathers(rathers_offset: number, endCallback: endCallback) {
  try {
    const url = `https://basic-would-you-rather-api.vercel.app/rathers/get/${rathers_offset}`;
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

    return false
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
