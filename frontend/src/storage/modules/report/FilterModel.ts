import Model from "@/appEntry/Model";

export default class FilterModel extends Model {
  dateFrom: string;
  dateTo: string;
  users: number[];
  page: number;
  perPage: number;
}
