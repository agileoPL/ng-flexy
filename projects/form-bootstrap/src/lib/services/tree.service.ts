import { Injectable } from '@angular/core';
import { FlexyTreeModelNode } from '../models/tree-model-node.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class FlexyTreeService {
  private subject: BehaviorSubject<FlexyTreeModelNode>;

  constructor() {
    this.subject = new BehaviorSubject<FlexyTreeModelNode>(null);
  }

  setSelectedId(node: FlexyTreeModelNode) {
    this.subject.next(node);
  }

  onChangeSelected(): Observable<FlexyTreeModelNode> {
    return this.subject.asObservable();
  }
}
