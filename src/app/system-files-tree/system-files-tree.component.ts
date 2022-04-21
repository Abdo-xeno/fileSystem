import { Component, OnInit } from '@angular/core';
import { TreeOfFilesService } from '../service/tree-of-files.service';

@Component({
  selector: 'app-system-files-tree',
  templateUrl: './system-files-tree.component.html',
  styleUrls: ['./system-files-tree.component.css']
})
export class SystemFilesTreeComponent implements OnInit {

  constructor(private treeService: TreeOfFilesService) { }
  test: any;

  ngOnInit(): void {
    this.getTreeOfFiles()
  }

  getTreeOfFiles(){
    this.treeService.getTreeOfFiles().subscribe(result=>{
      console.log('teset')
      this.test = result;
      console.log(typeof this.test)
      console.log(this.test)
    })
  }

}
