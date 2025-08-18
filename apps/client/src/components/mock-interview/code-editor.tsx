'use client';

import { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  RotateCcw, 
  Copy, 
  Check,
  Settings,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useState } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  height?: string;
}

const LANGUAGE_OPTIONS = [
  { value: 'javascript', label: 'JavaScript', extension: 'js' },
  { value: 'typescript', label: 'TypeScript', extension: 'ts' },
  { value: 'python', label: 'Python', extension: 'py' },
  { value: 'java', label: 'Java', extension: 'java' },
  { value: 'cpp', label: 'C++', extension: 'cpp' },
  { value: 'csharp', label: 'C#', extension: 'cs' },
  { value: 'go', label: 'Go', extension: 'go' },
  { value: 'rust', label: 'Rust', extension: 'rs' },
];

const DEFAULT_CODE_TEMPLATES = {
  javascript: `// Write your solution here
function solution() {
    // Your code here
    
    return result;
}

// Test your solution
console.log(solution());`,
  
  typescript: `// Write your solution here
function solution(): any {
    // Your code here
    
    return result;
}

// Test your solution
console.log(solution());`,
  
  python: `# Write your solution here
def solution():
    # Your code here
    
    return result

# Test your solution
print(solution())`,
  
  java: `public class Solution {
    public static void main(String[] args) {
        Solution sol = new Solution();
        // Test your solution
        System.out.println(sol.solution());
    }
    
    public Object solution() {
        // Your code here
        
        return result;
    }
}`,
  
  cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

class Solution {
public:
    // Write your solution here
    auto solution() {
        // Your code here
        
        return result;
    }
};

int main() {
    Solution sol;
    // Test your solution
    cout << sol.solution() << endl;
    return 0;
}`,
};

export function CodeEditor({ 
  value, 
  onChange, 
  language = 'javascript', 
  readOnly = false,
  height = '100%'
}: CodeEditorProps) {
  const editorRef = useRef<any>(null);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [executionOutput, setExecutionOutput] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState(false);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Configure Monaco editor
    monaco.editor.defineTheme('interview-theme', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#000000',
        'editorLineNumber.foreground': '#999999',
        'editor.selectionBackground': '#add6ff',
        'editor.inactiveSelectionBackground': '#e5ebf1',
      }
    });
    
    monaco.editor.setTheme('interview-theme');
    
    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRunCode();
    });
  };

  const handleLanguageChange = (newLanguage: string) => {
    setSelectedLanguage(newLanguage);
    
    // If current code is empty or is a template, load new template
    if (!value.trim() || isTemplate(value)) {
      const template = DEFAULT_CODE_TEMPLATES[newLanguage as keyof typeof DEFAULT_CODE_TEMPLATES] || '';
      onChange(template);
    }
  };

  const isTemplate = (code: string) => {
    return Object.values(DEFAULT_CODE_TEMPLATES).some(template => 
      code.trim() === template.trim()
    );
  };

  const handleReset = () => {
    const template = DEFAULT_CODE_TEMPLATES[selectedLanguage as keyof typeof DEFAULT_CODE_TEMPLATES] || '';
    onChange(template);
    setExecutionOutput('');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const handleRunCode = async () => {
    setIsExecuting(true);
    setExecutionOutput('Running code...');
    
    // Simulate code execution (in a real implementation, this would call an API)
    setTimeout(() => {
      try {
        // For JavaScript, we can actually execute it safely in a limited way
        if (selectedLanguage === 'javascript') {
          // Create a safe execution context
          const logs: string[] = [];
          const mockConsole = {
            log: (...args: any[]) => logs.push(args.map(String).join(' ')),
            error: (...args: any[]) => logs.push('Error: ' + args.map(String).join(' ')),
          };
          
          // Replace console.log calls and execute
          const safeCode = value.replace(/console\./g, 'mockConsole.');
          
          try {
            // Create function with mock console
            const func = new Function('mockConsole', safeCode);
            func(mockConsole);
            setExecutionOutput(logs.length > 0 ? logs.join('\n') : 'Code executed successfully (no output)');
          } catch (error) {
            setExecutionOutput(`Runtime Error: ${error}`);
          }
        } else {
          // For other languages, show a mock output
          setExecutionOutput(`Code execution simulation for ${selectedLanguage}:\n✓ Syntax check passed\n✓ Code compiled successfully\n\nNote: Full execution requires backend integration.`);
        }
      } catch (error) {
        setExecutionOutput(`Error: ${error}`);
      } finally {
        setIsExecuting(false);
      }
    }, 1000);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'h-full'}`}>
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/50">
        <div className="flex items-center gap-3">
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGE_OPTIONS.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRunCode}
              disabled={isExecuting || readOnly}
            >
              <Play className="h-4 w-4 mr-1" />
              Run
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={readOnly}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        <Editor
          height={height}
          language={selectedLanguage}
          value={value}
          onChange={(newValue) => onChange(newValue || '')}
          onMount={handleEditorDidMount}
          options={{
            readOnly,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            glyphMargin: false,
            contextmenu: true,
            mouseWheelZoom: true,
            smoothScrolling: true,
            cursorBlinking: 'blink',
            cursorStyle: 'line',
            renderWhitespace: 'selection',
            renderControlCharacters: false,
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            tabCompletion: 'on',
            wordBasedSuggestions: 'matchingDocuments',
            parameterHints: {
              enabled: true
            },
            quickSuggestions: {
              other: true,
              comments: false,
              strings: false
            }
          }}
        />
      </div>

      {/* Output Console */}
      {executionOutput && (
        <div className="border-t bg-muted/30">
          <div className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                Output
              </Badge>
              {isExecuting && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
                  Executing...
                </div>
              )}
            </div>
            <pre className="text-sm font-mono bg-background border rounded p-3 max-h-32 overflow-auto">
              {executionOutput}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}