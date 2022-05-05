import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
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
  @ViewChild(MatMenuTrigger, { static: false })
  matMenuTrigger!: MatMenuTrigger; 

  @ViewChild('searchbar') searchbar: ElementRef | undefined;
  searchText = '';

  toggleSearch: boolean = false;

  constructor(private treeService: TreeOfFilesService,
    private dialog: MatDialog) { }

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
 

  centerGraph() {
    this.center$.next(true)
  }

  testFolderName(node: any){
    this.fileNode = node;
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
    console.log('NODE IN HTMl', files)
    this.fileToUpload = files.files.item(0);
    console.log('file and path', this.fileToUpload, this.uploadedFilePath)
   
  
    
    this.treeService.postFile(this.fileToUpload, encodeURIComponent(this.uploadedFilePath)).subscribe(data => {
      console.log('uplodade path', this.uploadedFilePath)
    
      //this.treeService.addFileToDirectory(this.fileNode.path, this.fileToUpload).subscribe(result => {
        const dialogRef = this.dialog.open(PropertiesDialog, {        
          data: {file: this.fileToUpload, operation: 'upload file'},
        });
        dialogRef.afterClosed().subscribe(result => {
          this.onNodeSelected(this.uploadedNode)
        });
        //console.log(result)
      //})
      // do something, if upload success
    }, error => {
      console.log(error);
    });
  }
  uploadFileToActivity(node: any) {
    this.uploadedNode = node;
    this.uploadedFilePath = node.path;
    console.log('file activity',node)
  }

  onRightClick(event: MouseEvent, item: any) {
    // preventDefault avoids to show the visualization of the right-click menu of the browser
    event.preventDefault();
    console.log('menu', event)

    // we record the mouse position in our object
    this.menuTopLeftPosition.x = event.clientX;
    this.menuTopLeftPosition.y = event.clientY;
    console.log(this.menuTopLeftPosition)

    // we open the menu
    // we pass to the menu the information about our object
      console.log(this.matMenuTrigger)
      //this.matMenuTrigger['_menu']['_xPosition'] = this.menuTopLeftPosition.x ;
      //this.matMenuTrigger['_menu']['_yPosition'] = this.menuTopLeftPosition.y;
      this.matMenuTrigger.menuData = {item: item}


      // we open the menu
      this.matMenuTrigger.openMenu();

    


  }

  getExamples(n: number) {
    return [... Array(n).keys()];
  }
  

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
      this.searchText = this.initialPath;
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
    console.log('content', element.contents)
    element.contents.forEach((e:any) => {
      this.treeService.getFileSize(encodeURIComponent(linkLabel), e.name).subscribe((result: any) => {
        console.log(e.name,result)
        if (e.type == 'file'){
          this.initialNodes.push({
            id: e.name,
            label: e.name,
            type: e.type,
            path: linkLabel + `/${e.name}`,
            size: result.split('\n')[0]
          })
        }
        //console.log(e.name, result)
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
      this.treeService.getFilePath(encodeURIComponent(node.path)).subscribe((result: any) => {
        console.log(node)
        //console.log('result', result)

        const dialogRef = this.dialog.open(PropertiesDialog, {        
          data: {file: node.label, path: node.path, operation: 'search file'},
        });
        dialogRef.afterClosed().subscribe(result => {
        });
        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute('href', this.treeService.backEndUrl+ 'get/' + encodeURIComponent(node.path));
        link.setAttribute('download', node.label);
        //link.href = realPath;
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
        //this.getInitialPath();
        this.searchText = node.path
        this.updateGraph();
        this.getAllNodes(result[0], node.path, node.label)
      })
      /*this.treeService.getTreeOfFiles().subscribe(result=>{
        this.getAllNodes(node, 'root')
      })*/
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

  onRightClicktest(node: any){
    this.treeService.getFileContent(encodeURIComponent(node.path)).subscribe((result: any) => {
      console.log('ByteArray', result)
      const dialogRef = this.dialog.open(PropertiesDialog, {        
        data: {file: node, content: result},
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    })  

  }

}
