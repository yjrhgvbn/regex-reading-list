export interface ReadRecord {
  match: {
    type: "string" | "regex"
    value: string
  }
  title: string
  mark?: string
  currentUrl: string
  date: number
  position: {
    top: number
    process: number
  }
}
