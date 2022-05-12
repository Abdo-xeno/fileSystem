import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { TreeOfFilesService } from '../service/tree-of-files.service';
import { PropertiesDialog } from '../properties-dialog/properties-dialog.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-system-files-tree',
  templateUrl: './system-files-tree.component.html',
  styleUrls: ['./system-files-tree.component.scss']
})


export class SystemFilesTreeComponent implements OnInit {
  uploadedNode: any;
  fileNode: any;
  folderNameCreated: any = '';
  folderSize = 0;
  fileToUpload: File | null = null;
  uploadedFilePath: any;
  menuTopLeftPosition =  {x: 0, y: 0};
  zoomToFit$: Subject<boolean> = new Subject();
  update$: Subject<boolean> = new Subject();
  center$: Subject<boolean> = new Subject();
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
  @ViewChild(MatMenuTrigger, { static: false })
  matMenuTrigger!: MatMenuTrigger; 

  @ViewChild('searchbar') searchbar: ElementRef | undefined;
  searchText = '';

  toggleSearch: boolean = false;

  constructor(private treeService: TreeOfFilesService,
    private dialog: MatDialog) { }


  ngOnInit(): void {
    this.getInitialPath();
    this.getTreeOfFiles();
  }

  centerGraph() {
    this.center$.next(true)
  }

  fitGraph() {
    this.zoomToFit$.next(true)
  }

  updateGraph() {
    this.update$.next(true)
  }


  openSearch() {
    this.toggleSearch = true;
    if (this.searchbar){
      this.searchbar.nativeElement.focus();
    }
  }

  searchClose() {
    this.searchText = this.initialPath;
    this.toggleSearch = false;
  }

  actionOnPath(){
    var lastNamePath = this.searchText.split('/')
    var nodeLabel = this.searchText.split('/')[lastNamePath.length-1]
    this.treeService.isFile(encodeURIComponent(this.searchText)).subscribe((result: any) =>{
      console.log(result)
      if (result){
        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute('href', this.treeService.backEndUrl+ 'get/' + encodeURIComponent(this.searchText));
        link.setAttribute('download', nodeLabel);
        //link.href = realPath;
        console.log('LINK', link)
        document.body.appendChild(link);
        link.click();
        link.remove();
        const dialogRef = this.dialog.open(PropertiesDialog, {        
          data: {file: nodeLabel, path: this.searchText, operation: 'search file'},
        });
        dialogRef.afterClosed().subscribe(result => {
        });
      }
      else if (result == false){
        this.treeService.getTreeOfFilesOfDirectory(encodeURIComponent(this.searchText)).subscribe((data: any) => {
          const dialogRef = this.dialog.open(PropertiesDialog, {        
            data: {folder: nodeLabel, path:this.searchText, operation: 'search folder'},
          });
          dialogRef.afterClosed().subscribe(result => {
          });
          this.initialNodes = [
            {
              id: nodeLabel,
              label: nodeLabel,
              type: 'directory',
              path: this.searchText,
            }
          ];
          this.links = [];
          console.log(this.initialNodes)
          //this.getInitialPath();
          this.updateGraph();
          this.getAllNodes(data[0], this.searchText, nodeLabel)
        })

      }
      console.log(result)
    })
  }
 
  addNewFolder(node: any){
    const dialogRef = this.dialog.open(PropertiesDialog, {        
      data: {directory: node, operation: 'addNewDirectory'},
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.treeService.addDirectory(encodeURIComponent(node.path), result).subscribe((data: any) => {
          this.onNodeSelected(node)
        })
      }  
    });
  }

  handleFileInput(files: any) {
    this.fileToUpload = files.files.item(0);
    this.treeService.postFile(this.fileToUpload, encodeURIComponent(this.uploadedFilePath)).subscribe(data => {
        const dialogRef = this.dialog.open(PropertiesDialog, {        
          data: {file: this.fileToUpload, operation: 'upload file'},
        });
        dialogRef.afterClosed().subscribe(result => {
          this.onNodeSelected(this.uploadedNode)
        });
    }, error => {
      console.log(error);
    });
  }

  uploadFileToActivity(node: any) {
    this.uploadedNode = node;
    this.uploadedFilePath = node.path;
  }


  getInitialPath(){
    this.treeService.getDirectoryPath().subscribe(result => {
      console.log(result)
      this.initialPath = result
      this.initialPath = this.initialPath.split('\n')[0];
      this.searchText = this.initialPath;
    })
  }

  getTreeOfFiles(){
    this.treeService.getTreeOfFiles().subscribe(result=>{
      this.getAllNodes(result[0], this.initialPath, '')
    })
  }

  getAllNodes(element: any, linkLabel: string, nodeLabel: string){
    if (nodeLabel){
      (element.name == '.' ? element.name = nodeLabel : null);
    }
    else {
      (element.name == '.' ? element.name = 'src' : null);
    }
    element.contents.forEach((e:any) => {
      this.treeService.getFileSize(encodeURIComponent(linkLabel), e.name).subscribe((result: any) => {
        if (e.type == 'file'){
          this.initialNodes.push({
            id: e.name,
            label: e.name,
            type: e.type,
            path: linkLabel + `/${e.name}`,
            size: result.split('\n')[0],
          })
        }
        else {
          this.initialNodes.push({
            id: e.name,
            label: e.name,
            type: e.type,
            path: linkLabel + `/${e.name}`,
          })
        }
        
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
  }
  
  onNodeSelected(node: any){
    if (node.type == 'file'){
      this.treeService.getFilePath(encodeURIComponent(node.path)).subscribe((result: any) => {
        const dialogRef = this.dialog.open(PropertiesDialog, {        
          data: {file: node.label, path: node.path, operation: 'search file'},
        });
        dialogRef.afterClosed().subscribe(result => {
        });
        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute('href', this.treeService.backEndUrl+ 'get/' + encodeURIComponent(node.path));
        link.setAttribute('download', node.label);
        console.log('LINK', link)
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
    }
    else {
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
        const dialogRef = this.dialog.open(PropertiesDialog, {        
          data: {folder: node.label, path:node.path, operation: 'search folder'},
        });
        dialogRef.afterClosed().subscribe(result => {
        });
        this.searchText = node.path
        this.updateGraph();
        this.getAllNodes(result[0], node.path, node.label)
      })
    }
  }

  getExactDirectorySize(node: any){
    var subLinks = this.links.filter((link:any) => link.source == node.label )
    var childNodes: any[] = [];
    subLinks.forEach((link: any) => {
      this.initialNodes.forEach((node: any) => {
        if (node.label == link.target){
          childNodes.push(node)
        }
      })
    })
    childNodes.forEach((childNode: any) => {
      if (childNode.type == 'file'){
        this.folderSize += Number(childNode.size)
        console.log(childNode.label, childNode.size, this.folderSize)
      }
      else {
        this.getExactDirectorySize(childNode)
      }
    })
  }

  displayProperties(node: any){
    if (node.type == 'file'){
      this.treeService.getFileContent(encodeURIComponent(node.path)).subscribe((result: any) => {
        console.log('ByteArray', result)
        const dialogRef = this.dialog.open(PropertiesDialog, {        
          data: {file: node, content: result, operation: 'checkProperties'},
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
      })    
    }
    else if (node.type == 'directory'){
      this.folderSize = 0;
      this.getExactDirectorySize(node)
      const dialogRef = this.dialog.open(PropertiesDialog, {        
        data: {file: node, size: this.folderSize, operation: 'checkProperties'},
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }
    else {
      const dialogRef = this.dialog.open(PropertiesDialog, {        
        data: {file: node, type: 'link', operation: 'checkProperties'},
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }
  
  }
  
  addLink(node: any){
    const dialogRef = this.dialog.open(PropertiesDialog, {        
      data: {directory: node, operation: 'addNewLink'},
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.treeService.addLink(encodeURIComponent(node.path), encodeURIComponent(result)).subscribe((data: any) => {
          this.onNodeSelected(node)
        })
      }  
    });
  }

}
