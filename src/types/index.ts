export interface BookSectionsItem {
  sectionId: string
  status: BookSectionStatus
  title: string
}

export enum BookSectionStatus {
  NotStarted = 0,
  Started = 1
}
