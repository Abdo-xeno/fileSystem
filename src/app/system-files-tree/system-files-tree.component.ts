import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TreeOfFilesService } from '../service/tree-of-files.service';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-system-files-tree',
  templateUrl: './system-files-tree.component.html',
  styleUrls: ['./system-files-tree.component.css']
})


export class SystemFilesTreeComponent implements OnInit {
  menuTopLeftPosition =  {x: '0', y: '0'};
  zoomToFit$: Subject<boolean> = new Subject();
  update$: Subject<boolean> = new Subject();
  test: any;
  initialPath: any;
  initialNodes: any = [
    {
      id: 'src',
      label: 'src',
      type: 'directory',
      path: '',
      size : '0',
    }
  ];
  links: any = [];
  initialLink: string = 'root';
  @ViewChild(MatMenuTrigger, {static: true}) matMenuTrigger: MatMenuTrigger; 
  constructor(private treeService: TreeOfFilesService) { }
  

  fitGraph() {
    this.zoomToFit$.next(true)
  }

  updateGraph() {
    this.update$.next(true)
  }

  ngOnInit(): void {
    this.getInitialPath();
    this.getTreeOfFiles();
  }

  getInitialPath(){
    this.treeService.getDirectoryPath().subscribe(result => {
      console.log(result)
      this.initialPath = result
      this.initialPath = this.initialPath.split('\n')[0];
      console.log('INITAL PATH', this.initialPath)
    })
  }

  getTreeOfFiles(){
    this.treeService.getTreeOfFiles().subscribe(result=>{
      console.log('teset')
      this.test = result;
      console.log(typeof this.test)
      console.log(this.test)
      /*this.initialNodes.push({
        id: 'fourth',
        label: 'directory'
      })
     this.test[0].contents.forEach((e: any) => {
        this.initialNodes.push({
          id: 'fifth',
          label: e.name,
        })

      })*/
      this.getAllNodes(this.test[0], this.initialPath, '')
      
    })
  }

  getAllNodes(element: any, linkLabel: string, nodeLabel: string){
    if (nodeLabel){
      console.log('test');
      (element.name == '.' ? element.name = nodeLabel : null);
    }
    else {
      console.log('init');
      (element.name == '.' ? element.name = 'src' : null);
    }

    element.contents.forEach((e:any) => {
      this.treeService.getFileSize(encodeURIComponent(linkLabel), e.name).subscribe((result: any) => {
        //console.log(e.name, result)
        this.initialNodes.push({
          id: e.name,
          label: e.name,
          type: e.type,
          path: linkLabel + `/${e.name}`,
          size: result.split('\n')[0]
        })
        this.links.push({
          id: `${element.name}-${e.name}`,
          source: element.name,
          target: e.name,
          label: linkLabel + `/${e.name}`
        })
        if (e.contents && e.contents.length > 0) {
          this.getAllNodes(e, linkLabel + `/${e.name}`, '')
        }
        this.updateGraph();
      })
     

   
    })
    console.log('finale', this.initialNodes)
    var allNodes = new Set(this.initialNodes)
    console.log('finale test', allNodes)
    console.log(this.links)
  }

  clickButton(){
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', "/home/qbdel/FileS…/app/app.component.html");
    link.setAttribute('download', "app.component.html");
    //link.href = realPath;
    console.log('LINK', link)
    document.body.appendChild(link);
    link.click();
    link.remove();


  }
  
  onNodeSelected(node: any){
    console.log('file://'+node.path);
    var realPath = 'file://'+node.path
    if (node.type == 'file'){

      
      /*const link = document.createElement('a');
      link.setAttribute('target', '_blank');
      link.setAttribute('href', node.path);
      link.setAttribute('download', node.label);
      link.href = realPath;
      console.log('LINK', link)
      document.body.appendChild(link);
      link.click();
      link.remove();*/
      //this.treeService.getFilePath(encodeURIComponent(node.path)).subscribe((result: any) => {
        console.log(node)
        //console.log('result', result)
        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute('href', this.treeService.backEndUrl+ 'get/' + encodeURIComponent(node.path));
        link.setAttribute('download', node.label);
        //link.href = realPath;
        console.log('LINK', link)
        document.body.appendChild(link);
        link.click();
        link.remove();
      //})

  

      
    }
    else {
      console.log(node)
      console.log('Path', node.path.split('/'))
      console.log(node.path.replace('/', '-'))
      this.treeService.getTreeOfFilesOfDirectory(encodeURIComponent(node.path)).subscribe((result: any) => {
        console.log(result)
        this.initialNodes = [
          {
            id: node.label,
            label: node.label,
            type: 'directory',
            path: node.path,
          }
        ];
        this.links = [];
        //this.getInitialPath();
        this.updateGraph();
        this.getAllNodes(result[0], node.path, node.label)
      })
      /*this.treeService.getTreeOfFiles().subscribe(result=>{
        this.getAllNodes(node, 'root')
      })*/
    }
 
  }

  onRightClick(event: any){
    console.log(event)
  }

}
