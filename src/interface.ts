export interface ReadRecord {
  id: string
  match: {
    type: "string" | "regex"
    value: string
  }
  title: string
  mark?: string
  currentUrl: string
  createAt: number
  position: {
    top: number
    progress: number
  }
  favIconUrl?: string
}

export interface MessageRespone<T> {
  name: string
  body: T
}

export type Optional<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>
